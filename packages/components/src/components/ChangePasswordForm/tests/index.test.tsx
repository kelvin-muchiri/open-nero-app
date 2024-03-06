// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { notification } from 'antd';
import { ChangePasswordForm } from '..';
import { NeroAPIService } from '@nero/api-service';

const apiService = NeroAPIService.getInstance('https://api.domainbandia.bandia/', 'refresh', () =>
  jest.fn()
);

const mock = new MockAdapter(apiService.getAxiosInstance());

jest.setTimeout(30000);

afterEach(() => {
  mock.reset();
});

const props = {
  neroAPIService: apiService,
};

test('renders correctly', () => {
  mock.onPost('/users/change-password/').reply(200, {});

  render(<ChangePasswordForm {...props} />);
  expect(screen.queryByLabelText('New Password')).toBeInTheDocument();
  expect(screen.queryByLabelText('Confirm New Password')).toBeInTheDocument();
  expect(screen.queryByText('Submit')).toBeInTheDocument();
});

test('submits', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/change-password/').reply(200, {});

  render(<ChangePasswordForm {...props} />);
  await user.type(screen.getByLabelText('New Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm New Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/change-password/');
  expect(mock.history.post[0].data).toEqual(
    JSON.stringify({
      password: 'password123',
      confirm_password: 'password123',
    })
  );
  expect(screen.getByText(/success/i)).toBeInTheDocument();
  // fields are cleared
  expect(screen.getByLabelText('New Password')).toHaveValue('');
  expect(screen.getByLabelText('Confirm New Password')).toHaveValue('');
});

test('password is required', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/change-password/').reply(200, {});

  render(<ChangePasswordForm {...props} />);

  await user.type(screen.getByLabelText('Confirm New Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/password required/i)).toBeInTheDocument();
  });
  // API call not make
  expect(mock.history.post).toHaveLength(0);
});

test('password min length is 6 chars', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/change-password/').reply(200, {});

  render(<ChangePasswordForm {...props} />);
  // 5 chars fials
  const invalidPassword = 'Lorem';
  expect(invalidPassword).toHaveLength(5);
  await user.type(screen.getByLabelText('New Password'), invalidPassword);
  await user.type(screen.getByLabelText('Confirm New Password'), invalidPassword);
  await user.click(screen.getByText('Submit'));
  // API call not made
  expect(screen.getByText(/minimum length is 6 characters/i)).toBeInTheDocument();
  expect(mock.history.post).toHaveLength(0);

  // 6 chars passes
  mock.resetHistory();
  const validPassword = invalidPassword + 'a';
  expect(validPassword).toHaveLength(6);
  await user.clear(screen.getByLabelText('New Password'));
  await user.clear(screen.getByLabelText('Confirm New Password'));
  await user.type(screen.getByLabelText('New Password'), validPassword);
  await user.type(screen.getByLabelText('Confirm New Password'), validPassword);
  await user.click(screen.getByText('Submit'));
  // user created
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/change-password/');
});

test('password max length is 255 chars', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/change-password/').reply(200, {});

  render(<ChangePasswordForm {...props} />);
  // 256 chars fails
  const invalidPassword =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure doloruii';
  expect(invalidPassword).toHaveLength(256);
  const passwordInput = screen.getByLabelText('New Password');
  const confirmInput = screen.getByLabelText('Confirm New Password');
  await user.type(passwordInput, invalidPassword);
  await user.type(confirmInput, invalidPassword);
  await user.click(screen.getByText('Submit'));

  // API call not made
  expect(screen.getByText(/maximum length is 255 characters/i)).toBeInTheDocument();
  expect(mock.history.post).toHaveLength(0);

  // 255 chars passes
  mock.resetHistory();

  const validPassword = invalidPassword.slice(0, -1);
  expect(validPassword).toHaveLength(255);

  await user.clear(passwordInput);
  await user.clear(confirmInput);
  await user.type(passwordInput, validPassword);
  await user.type(confirmInput, validPassword);
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/change-password/');
});

test('confirm password should match password', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/change-password/').reply(200, {});

  render(<ChangePasswordForm {...props} />);

  await user.type(screen.getByLabelText('New Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm New Password'), 'foo');
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/the two passwords that you entered do not match/i)).toBeInTheDocument();
  // API call not made
  expect(mock.history.post).toHaveLength(0);
});

test('handles error if API call fails', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/change-password/').reply(500, {});
  const mockNotificationError = jest.spyOn(notification, 'error');
  render(<ChangePasswordForm {...props} />);
  await user.type(screen.getByLabelText('New Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm New Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  expect(mockNotificationError).toHaveBeenCalledWith({ message: 'Something went wrong!' });
});

test('success message is cleared if API calls fails after successful submission', async () => {
  const user = userEvent.setup();
  mock
    .onPost('/users/change-password/')
    .replyOnce(200, {})
    .onPost('/users/change-password/')
    .replyOnce(500, {});
  const mockNotificationError = jest.spyOn(notification, 'error');
  render(<ChangePasswordForm {...props} />);
  await user.type(screen.getByLabelText('New Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm New Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/success/i)).toBeInTheDocument();
  // we fill the form again
  await user.type(screen.getByLabelText('New Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm New Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
  expect(mockNotificationError).toHaveBeenCalledWith({ message: 'Something went wrong!' });
});
