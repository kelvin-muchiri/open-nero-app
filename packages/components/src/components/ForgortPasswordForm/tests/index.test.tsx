// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { ForgotPasswordForm } from '..';
import { ProfileType } from '@nero/query-api-service';
import { NeroAPIService } from '@nero/api-service';

const apiService = NeroAPIService.getInstance('https://api.domainbandia.bandia/', 'refresh', () =>
  jest.fn()
);
const mock = new MockAdapter(apiService.getAxiosInstance());

afterEach(() => {
  mock.reset();
});

const props = {
  profileType: 'CUSTOMER' as ProfileType,
  neroAPIService: apiService,
};

test('renders correctly', () => {
  render(<ForgotPasswordForm {...props} />);
  expect(screen.queryByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByText('Submit')).toBeInTheDocument();
});

test('submits', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/start/').reply(200, {});

  render(<ForgotPasswordForm {...props} />);

  await user.type(screen.getByText('Email'), 'janedoe@example.com');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/reset-password/start/');
  expect(mock.history.post[0].data).toEqual(
    JSON.stringify({ email: 'janedoe@example.com', profile_type: 'CUSTOMER' })
  );
  expect(
    screen.getByText(
      'Instructions on how to to reset your password have been emailed to your email address. Please check your email including the spam folder'
    )
  ).toBeInTheDocument();
  // form is reset
  expect(screen.getByLabelText('Email')).toHaveValue('');
});

test('email is required', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/start/').reply(200, {});

  render(<ForgotPasswordForm {...props} />);

  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText('Email required')).toBeInTheDocument();
  });
});

test('email is valid', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/start/').reply(200, {});

  render(<ForgotPasswordForm {...props} />);

  await user.type(screen.getByText('Email'), 'foo');
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
});

test('handles API error', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/start/').reply(500, {});

  render(<ForgotPasswordForm {...props} />);

  await user.type(screen.getByText('Email'), 'janedoe@example.com');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/reset-password/start/');
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

test('clears success message if form values change', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/start/').reply(200, {});

  render(<ForgotPasswordForm {...props} />);

  await user.type(screen.getByText('Email'), 'janedoe@example.com');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/reset-password/start/');
  expect(screen.getByText(/instructions/i)).toBeInTheDocument();
  await user.type(screen.getByText('Email'), 'foo@example.com');
  expect(screen.queryByText(/instructions/i)).not.toBeInTheDocument();
});

test('clears failed message if form values change', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/start/').reply(500, {});

  render(<ForgotPasswordForm {...props} />);

  await user.type(screen.getByText('Email'), 'janedoe@example.com');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/reset-password/start/');
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  await user.type(screen.getByText('Email'), 'foo@example.com');
  expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
});
