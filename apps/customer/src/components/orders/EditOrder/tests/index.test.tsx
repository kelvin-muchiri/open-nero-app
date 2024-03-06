import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import { store } from '../../../../store/store';
import { EditOrder } from '..';
import * as fixtures from './fixtures';
import { apiService, queryService } from '../../../../services/api';

/* eslint-disable  @typescript-eslint/no-unnecessary-type-assertion */

const mock = new MockAdapter(apiService.getAxiosInstance());
const mockUseNavigate = jest.fn();

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const Select = ({ children, onChange, ...otherProps }: any) => {
    return (
      <select {...otherProps} loading={undefined} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    );
  };

  const Option = ({ children, ...otherProps }: any) => {
    return <option {...otherProps}>{children}</option>;
  };

  Select.Option = Option;

  return {
    __esModule: true,
    ...antd,
    Select,
  };
});

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

test('form initialized with item values', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  mock.onGet('/cart/').reply(200, fixtures.cart);

  const item = fixtures.cart.cart.items[0];

  render(
    <Provider store={store}>
      <EditOrder id={item.id} />
    </Provider>
  );

  // step 1 form initial values are correct
  await waitFor(() => {
    expect((screen.getByText(item.paper.name) as HTMLOptionElement).selected).toBe(true);
  });

  expect((screen.getByText(item.level.name) as HTMLOptionElement).selected).toBe(true);
  expect((screen.getByText(item.deadline.full_name) as HTMLOptionElement).selected).toBe(true);
  expect((screen.getByText(item.course.name) as HTMLOptionElement).selected).toBe(true);
  expect(screen.getByLabelText('No. of pages')).toHaveValue(item.pages.toString());
  expect(screen.getByLabelText('Quantity')).toHaveValue(item.quantity.toString());

  // go to step 2
  await waitFor(async () => {
    await user.click(screen.getByText('Next'));
  });

  // step 2 form initial values are correct
  expect(screen.getByLabelText('Topic')).toHaveValue(item.topic);
  expect(screen.getByLabelText('No. of references')).toHaveValue(item.references.toString());
  expect(screen.getByLabelText('Instructions')).toHaveValue(item.comment);
  expect((screen.getByText(item.paper_format.name) as HTMLOptionElement).selected).toBe(true);
  expect((screen.getByText(item.language.name) as HTMLOptionElement).selected).toBe(true);
});

test('edits order item', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  mock.onGet('/cart/').reply(200, fixtures.cart);
  const item = fixtures.cart.cart.items[0];
  mock.onPut(`/cart/items/${item.id}/`).reply(200, {});

  const topic = 'The effects of World War 2';
  const paper = fixtures.paperList[2];
  const level = paper.levels[0];
  const deadline = level.deadlines[0];
  const course = fixtures.courseList[0];
  const paper_format = fixtures.formatList[2];
  const pages = 10;
  const references = 7;
  const comment = 'This is an update';
  const quantity = 3;

  render(
    <Provider store={store}>
      <EditOrder id={item.id} />
    </Provider>
  );

  // select paper (wait for get papers async to finish)
  await waitFor(async () => {
    await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  });
  await user.selectOptions(screen.getByLabelText('Academic Level'), level.id);
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  await user.clear(screen.getByLabelText('No. of pages')); // clear initial value
  await user.type(screen.getByLabelText('No. of pages'), pages.toString());
  await user.clear(screen.getByLabelText('Quantity')); // clear initial value
  await user.type(screen.getByLabelText('Quantity'), quantity.toString());
  await user.selectOptions(screen.getByLabelText('Course'), course.id);
  await user.click(screen.getByText('Next'));

  // step 2 is now rendered
  await user.clear(screen.getByLabelText('Topic')); // clear initial value
  await user.type(screen.getByLabelText('Topic'), topic);
  await user.clear(screen.getByLabelText('No. of references')); // clear initial value
  await user.type(screen.getByLabelText('No. of references'), references.toString());
  await user.selectOptions(screen.getByLabelText('Paper Format'), paper_format.id);
  await user.selectOptions(screen.getByLabelText('Language'), '2');
  await user.clear(screen.getByLabelText('Instructions')); // clear initial value
  await user.type(screen.getByLabelText('Instructions'), comment);
  await user.click(screen.getByText('Add to cart'));
  expect(mock.history.put).toHaveLength(1);
  expect(mock.history.put[0].url).toBe(`/cart/items/${item.id}/`);
  expect(mock.history.put[0].data).toBe(
    JSON.stringify({
      topic,
      level: level.id,
      course: course.id,
      paper: paper.id,
      paper_format: paper_format.id,
      deadline: deadline.id,
      language: '2',
      pages,
      references,
      comment,
      quantity,
    })
  );
  expect(mockUseNavigate).toHaveBeenCalledWith('/past-orders/cart');
});

test('server errors are handled when API call fails', async () => {
  const user = userEvent.setup();
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  mock.onGet('/cart/').reply(200, fixtures.cart);
  const item = fixtures.cart.cart.items[0];
  mock.onPut(`/cart/items/${item.id}/`).reply(500);
  const mockNotificationError = jest.spyOn(notification, 'error');

  const topic = 'The effects of World War 2';
  const paper = fixtures.paperList[2];
  const level = paper.levels[0];
  const deadline = level.deadlines[0];
  const course = fixtures.courseList[0];
  const paper_format = fixtures.formatList[2];
  const pages = 10;
  const references = 7;
  const comment = 'This is an update';
  const quantity = 3;

  render(
    <Provider store={store}>
      <EditOrder id={item.id} />
    </Provider>
  );

  // select paper (wait for get papers async to finish)
  await waitFor(async () => {
    await user.selectOptions(screen.getByLabelText('Paper'), paper.id);
  });
  await user.selectOptions(screen.getByLabelText('Academic Level'), level.id);
  await user.selectOptions(screen.getByLabelText('Deadline'), deadline.id);
  await user.clear(screen.getByLabelText('No. of pages')); // clear initial value
  await user.type(screen.getByLabelText('No. of pages'), pages.toString());
  await user.clear(screen.getByLabelText('Quantity')); // clear initial value
  await user.type(screen.getByLabelText('Quantity'), quantity.toString());
  await user.selectOptions(screen.getByLabelText('Course'), course.id);
  await user.click(screen.getByText('Next'));

  // step 2 is now rendered
  await user.clear(screen.getByLabelText('Topic')); // clear initial value
  await user.type(screen.getByLabelText('Topic'), topic);
  await user.clear(screen.getByLabelText('No. of references')); // clear initial value
  await user.type(screen.getByLabelText('No. of references'), references.toString());
  await user.selectOptions(screen.getByLabelText('Paper Format'), paper_format.id);
  await user.selectOptions(screen.getByLabelText('Language'), '2');
  await user.clear(screen.getByLabelText('Instructions')); // clear initial value
  await user.type(screen.getByLabelText('Instructions'), comment);
  await user.click(screen.getByText('Add to cart'));
  expect(mock.history.put).toHaveLength(1);
  expect(mockNotificationError).toHaveBeenCalledWith({ message: 'Something went wrong!' });
});

test('handles error when fetching cart fails', async () => {
  mock.onGet('/catalog/papers/').reply(200, fixtures.paperList);
  mock.onGet('/catalog/courses/').reply(200, fixtures.courseList);
  mock.onGet('/catalog/formats/').reply(200, fixtures.formatList);
  mock.onGet('/cart/').reply(500);

  const item = fixtures.cart.cart.items[0];

  render(
    <Provider store={store}>
      <EditOrder id={item.id} />
    </Provider>
  );
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
