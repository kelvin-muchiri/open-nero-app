// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { NeroAPIService } from '@nero/api-service';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { ProfileType } from '@nero/query-api-service';
import { LoginForm } from '..';

const apiService = NeroAPIService.getInstance('https://api.domainbandia.bandia/', 'refresh', () =>
  jest.fn()
);

const mockAPI = new MockAdapter(apiService.getAxiosInstance());

const props = {
  neroApiService: apiService,
  profileType: 'CUSTOMER' as ProfileType,
  onForgotPassword: jest.fn(),
  onLoginSuccess: jest.fn(),
  onLoginFailed: jest.fn(),
};
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

afterEach(() => {
  mockAPI.reset();
});

test('renders correctly', () => {
  render(<LoginForm {...props} />);
  expect(screen.queryByLabelText('Email')).toBeInTheDocument();
  expect(screen.queryByLabelText('Remember me')).toBeInTheDocument();
  // remember me is checked by default
  expect(screen.queryByLabelText('Remember me')).toBeChecked();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.queryByText('Submit')).toBeInTheDocument();
  expect(screen.queryByText('Forgot password')).toBeInTheDocument();
});

test('forgot password button works', async () => {
  const user = userEvent.setup();
  render(<LoginForm {...props} />);
  await user.click(screen.getByText('Forgot password'));
  expect(props.onForgotPassword).toHaveBeenCalled();
});

test('submits correctly', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(200, {
    user: mockUser,
  });

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(mockAPI.history.post).toHaveLength(1);
    expect(mockAPI.history.post[0].data).toBe(
      JSON.stringify({ username: email, password: password, profile_type: 'CUSTOMER' })
    );
    expect(mockAPI.history.post[0].url).toBe('/auth/token/');
    expect(props.onLoginSuccess).toHaveBeenCalledWith(mockUser, true);
  });
});

test('email is required', async () => {
  const user = userEvent.setup();
  mockAPI.onPost(tokenEndpoint).reply(200);

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Password'), password);
  expect(screen.getByLabelText('Email')).toHaveValue('');
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

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Email'), email);
  expect(screen.getByLabelText('Password')).toHaveValue('');
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

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/some non field error/i)).toBeInTheDocument();
    expect(screen.getByText(/user name invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid password/i)).toBeInTheDocument();
    expect(props.onLoginFailed).toHaveBeenCalled();
  });
});

test('handles server 500 error', async () => {
  const user = userEvent.setup();

  mockAPI.onPost(tokenEndpoint).reply(500);

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
  expect(props.onLoginFailed).toHaveBeenCalled();
});

test('user can opt out of remember me', async () => {
  const user = userEvent.setup();

  mockAPI.onPost(tokenEndpoint).reply(200, {
    user: mockUser,
  });

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByLabelText('Remember me'));
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.queryByLabelText('Remember me')).not.toBeChecked();
  });
});

test('handles incorrect credentials', async () => {
  const user = userEvent.setup();

  mockAPI.onPost(tokenEndpoint).reply(401);

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/incorrect password or email/i)).toBeInTheDocument();
    expect(props.onLoginFailed).toHaveBeenCalled();
  });
});

test('handles too many recent attempts failure', async () => {
  const user = userEvent.setup();

  mockAPI.onPost(tokenEndpoint).reply(429);

  render(<LoginForm {...props} />);

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/Too many recent attempts, try again later/i)).toBeInTheDocument();
    expect(props.onLoginFailed).toHaveBeenCalled();
  });
});
