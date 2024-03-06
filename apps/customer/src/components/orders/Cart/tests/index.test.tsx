import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { store } from '../../../../store/store';
import { Cart } from '..';
import * as fixtures from './fixtures';
import { BrowserRouter } from 'react-router-dom';
import { notification } from 'antd';
import { apiService, queryService } from '../../../../services/api';

const mock = new MockAdapter(apiService.getAxiosInstance());
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockUseNavigate,
  };
});

afterEach(() => {
  // clear RTK Query cache after each test
  store.dispatch(queryService.util.resetApiState());
  mock.reset();
});

const { cart } = fixtures.cart;
const { items } = cart;

test('renders correctly', async () => {
  mock.onGet('/cart/').reply(200, fixtures.cart);
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Cart');
    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(/order summary/i);
    expect(screen.getByText('Cart subtotal')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
    expect(screen.getByText('$43.00')).toBeInTheDocument();
    expect(screen.getByText('$-8.60')).toBeInTheDocument();
    expect(screen.getByText('$34.40')).toBeInTheDocument();
    expect(screen.getByText(items[0].topic)).toBeInTheDocument();
    expect(screen.getByText(items[1].topic)).toBeInTheDocument();
    // each item has an edit & delete button
    expect(screen.getAllByLabelText('edit')).toHaveLength(2);
    expect(screen.getAllByLabelText('delete')).toHaveLength(2);
    expect(screen.getByText('Apply coupon code')).toBeInTheDocument();
    expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
    expect(screen.getByText('Continue shopping')).toBeInTheDocument();
    // apply coupon field is not visible
    expect(screen.queryByPlaceholderText('Enter coupon code')).not.toBeInTheDocument();
  });
});

test('renders correctly if coupon not applied and best match coupon available', async () => {
  mock.onGet('/cart/').reply(200, fixtures.cartCouponNotApplied);
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(
    () => {
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Cart');
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(/order summary/i);
      expect(screen.getByText('Cart subtotal')).toBeInTheDocument();
      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
      expect(screen.getByText('Grand Total')).toBeInTheDocument();
      expect(screen.getAllByText('$43.00')).toHaveLength(2);
      expect(screen.getByText('Apply coupon code')).toBeInTheDocument();
      expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
      expect(screen.getByText('Continue shopping')).toBeInTheDocument();
      // apply coupon field is visible to the user with the best match
      // coupon code as the default value
      expect(screen.getByPlaceholderText('Enter coupon code')).toHaveValue(
        fixtures.cartCouponNotApplied.cart.best_match_coupon.code
      );
      expect(screen.getByText('Save $8.60')).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
});

test('renders correctly if coupon not applied and best match not available', async () => {
  mock.onGet('/cart/').reply(200, fixtures.cartNoBestMatchCoupon);
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Cart');
    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(/order summary/i);
    expect(screen.getByText('Cart subtotal')).toBeInTheDocument();
    expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
    expect(screen.getAllByText('$43.00')).toHaveLength(2);
    expect(screen.getByText('Apply coupon code')).toBeInTheDocument();
    expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
    expect(screen.getByText('Continue shopping')).toBeInTheDocument();
    // apply coupon field is NOT visible to the user
    expect(screen.queryByPlaceholderText('Enter coupon code')).not.toBeInTheDocument();
  });
});

test('edit item works', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cart);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(
    async () => {
      await user.click(screen.getAllByLabelText('edit')[0]);
    },
    { timeout: 3000 }
  );
  expect(mockUseNavigate).toHaveBeenLastCalledWith(`/past-orders/place-order/${items[0].id}`);
});

test('remove item works', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cart);
  mock.onPost(`/cart/${cart.id}/remove/`).reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.click(screen.getAllByLabelText('delete')[0]);
  });
  // pop up shows for confirmation
  await waitFor(() => {
    expect(screen.getByText(/are you sure you want to remove this item?/i)).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Yes'));

  await waitFor(() => {
    expect(mock.history.post).toHaveLength(1);
  });

  expect(mock.history.post[0].url).toBe(`/cart/${cart.id}/remove/`);
  expect(mock.history.post[0].data).toBe(
    JSON.stringify({
      item: items[0].id,
    })
  );
});

test('handles error when fetching cart fails', async () => {
  mock.onGet('/cart/').reply(500, {});
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

test('no cart renders correctly', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, { cart: null });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/place order/i)).toBeInTheDocument();
  });
  await user.click(screen.getByText(/place order/i));
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/past-orders/place-order');
});

test('existing empty cart renders correctly', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, { cart: { id: 'id', total: '0.00', items: [] } });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/place order/i)).toBeInTheDocument();
  });
  await user.click(screen.getByText(/place order/i));
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/past-orders/place-order');
});

test('apply coupon works', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cartNoBestMatchCoupon);
  mock.onPost('/coupons/apply/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    // apply coupon field is not visible
    expect(screen.queryByPlaceholderText('Enter coupon code')).not.toBeInTheDocument();
    await user.click(screen.getByText('Apply coupon code'));
  });
  await waitFor(() => {
    // apply coupon field is now visible
    expect(screen.queryByPlaceholderText('Enter coupon code')).toBeInTheDocument();
    expect(screen.queryByText('Apply')).toBeInTheDocument();
  });
  await user.type(screen.getByPlaceholderText('Enter coupon code'), 'COUP40');
  await user.click(screen.getByText('Apply'));
  await waitFor(() => {
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe('/coupons/apply/');
    // coupon code input is cleared
    expect(screen.getByPlaceholderText('Enter coupon code')).toHaveValue('');
    expect(screen.getByText('Success: The coupon was applied')).toBeInTheDocument();
  });
});

test('handles server validation errors when applying coupon', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cartNoBestMatchCoupon);
  mock.onPost('/coupons/apply/').reply(400, { non_field_errors: ['Invalid coupon '] });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );
  await waitFor(async () => {
    await user.click(screen.getByText('Apply coupon code'));
  });
  await user.type(screen.getByPlaceholderText('Enter coupon code'), 'COUP40');
  await user.click(screen.getByText('Apply'));
  await waitFor(() => {
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe('/coupons/apply/');
    // coupon code input is not cleared
    expect(screen.getByPlaceholderText('Enter coupon code')).toHaveValue('COUP40');
    expect(screen.getByText('Invalid coupon')).toBeInTheDocument();
  });
});

test('handles server NON validation errors when applying coupon', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cartNoBestMatchCoupon);
  mock.onPost('/coupons/apply/').reply(500, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );
  await waitFor(async () => {
    await user.click(screen.getByText('Apply coupon code'));
  });
  await user.type(screen.getByPlaceholderText('Enter coupon code'), 'COUP40');
  await user.click(screen.getByText('Apply'));
  await waitFor(() => {
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe('/coupons/apply/');
    // coupon code input is not cleared
    expect(screen.getByPlaceholderText('Enter coupon code')).toHaveValue('COUP40');
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

test('continue shopping button works', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cartCouponNotApplied);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );
  await waitFor(async () => {
    await user.click(screen.getByText('Continue shopping'));
  });
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/past-orders/place-order');
});

test('checkout button works', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cartCouponNotApplied);
  mock.onPost('/orders/self/').reply(200, fixtures.orderCreated);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.click(screen.getByText('Proceed to checkout'));
  });
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/make-payment', {
    state: { orderId: fixtures.orderCreated.id },
  });
});

test('handles API error when creating order', async () => {
  const user = userEvent.setup();
  mock.onGet('/cart/').reply(200, fixtures.cartCouponNotApplied);
  mock.onPost('/orders/self.').reply(500, {});
  const mockNotificationError = jest.spyOn(notification, 'error');

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.click(screen.getByText('Proceed to checkout'));
  });
  expect(mockNotificationError).toHaveBeenCalledWith({ message: 'Something went wrong!' });
});
