import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '..';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import { apiService } from '../../../services/api';

const mockAPI = new MockAdapter(apiService.getAxiosInstance());
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();

beforeAll(() => {
  Storage.prototype.setItem = mockSetItem;
  Storage.prototype.getItem = mockGetItem;
});

afterEach(() => {
  mockAPI.reset();
});

const tokenEndpoint = '/auth/token/';
const email = 'janedoe@gmail.com';
const password = 'password1234';
const mockUser = {
  id: '0578c9b7-6e40-4a41-9d6d-344a85d95fa5',
  first_name: 'Jane',
  last_name: 'Doe',
  full_name: 'Jane Doe',
  email: 'janedoe@example.com',
  is_email_verified: true,
  profile_type: 'CUSTOMER',
};

test('renders correctly', async () => {
  const user = userEvent.setup();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.queryByLabelText('Email')).toBeInTheDocument();
  expect(screen.queryByLabelText('Remember me')).toBeInTheDocument();
  // remember me is checked by default
  expect(screen.queryByLabelText('Remember me')).toBeChecked();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByText('Submit')).toBeInTheDocument();
  expect(screen.queryByText('Forgot password')).toBeInTheDocument();
  await user.click(screen.getByText('Forgot password'));
});

test('submits correctly', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(200, {
    user: mockUser,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  expect(mockAPI.history.post).toHaveLength(1);
  expect(mockAPI.history.post[0].data).toBe(
    JSON.stringify({ username: email, password: password, profile_type: 'CUSTOMER' })
  );
  expect(mockAPI.history.post[0].url).toBe('/auth/token/');
  expect(store.getState().auth.isAuthenticated).toBe(true);
  expect(store.getState().auth.user).toEqual(mockUser);
  expect(mockSetItem).toHaveBeenNthCalledWith(1, 'rememberMe', 'true');
  expect(mockSetItem).toHaveBeenNthCalledWith(2, 'isUserLogged', 'true');
});

test('email is required', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(200);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/email required/i)).toBeInTheDocument();
  });
  // api not called
  expect(mockAPI.history.post).toHaveLength(0);
});

test('password is required', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(200);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/password required/i)).toBeInTheDocument();
  });
  // api not called
  expect(mockAPI.history.post).toHaveLength(0);
});

test('handles server validation errors', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(400, {
    non_field_errors: ['some non field error'],
    username: ['User name invalid'],
    password: ['Invalid password'],
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/some non field error/i)).toBeInTheDocument();
    expect(screen.getByText(/user name invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid password/i)).toBeInTheDocument();
  });
});

test('handles unknown network error', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(500);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

test('user can opt out of remember me', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(200, {
    user: mockUser,
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByLabelText('Remember me'));
  await user.click(screen.getByText('Submit'));
  expect(mockSetItem).toHaveBeenCalledWith('rememberMe', 'false');
});

test('handles incorrect credentials', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(401);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/incorrect password or email/i)).toBeInTheDocument();
});

test('handles too many recent attempts failure', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(429);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/Too many recent attempts, try again later/i)).toBeInTheDocument();
});
