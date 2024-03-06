import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import { notification } from 'antd';
import { store } from '../../../../store/store';
import { ChangeEmail } from '..';
import * as fixtures from '../../tests/fixtures';
import { apiService, queryService } from '../../../../services/api';

const mock = new MockAdapter(apiService.getAxiosInstance());

afterEach(() => {
  // This is the solution to clear RTK Query cache after each test
  store.dispatch(queryService.util.resetApiState());
  mock.reset();
});

test('renders correctly', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('Email')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).toBeInTheDocument();
  });
  // submit button is disabled until form is edited
  await user.click(screen.getByText('Submit'));
  expect(mock.history.patch).toHaveLength(0);
});

test('changes email on save', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, fixtures.user);
  mock.onPost('/users/check-exists/email/').reply(200, { exists: false });
  const mockNotificationSuccess = jest.spyOn(notification, 'success');

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Email')); // clear initial
    await user.type(screen.getByLabelText('Email'), 'tyrabanks@example.com');
  });
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(2);
  // called on blur
  expect(mock.history.post[0].url).toBe('/users/check-exists/email/');
  // called on submit
  expect(mock.history.post[1].url).toBe('/users/check-exists/email/');
  expect(mock.history.patch).toHaveLength(1);
  expect(mock.history.patch[0].url).toBe('/users/profile/');
  expect(mock.history.patch[0].data).toBe(
    JSON.stringify({
      email: 'tyrabanks@example.com',
    })
  );
  // rtk query refetches new profile data
  expect(mock.history.get[1].url).toBe('/users/profile/');
  expect(mockNotificationSuccess).toHaveBeenCalledWith({
    message: 'Success',
    description:
      'A verification link has been sent to your new email. Please click on that link to verify and update your email. Check the spam folder incase the email was incorrectly identfied',
    duration: 0,
  });
});

test('email should be unique', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPost('/users/check-exists/email/').reply(200, { exists: true });
  mock.onPatch('/users/profile/').reply(200, fixtures.user);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Email')); // clear initial
    await user.type(screen.getByLabelText('Email'), 'emailexists@example.com');
  });
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.queryByText(/an account with that email already exists/i)).toBeInTheDocument();
  });
  // user not created
  expect(mock.history.post).toHaveLength(2);
  // called on blur
  expect(mock.history.post[0].url).toBe('/users/check-exists/email/');
  // called on submit
  expect(mock.history.post[1].url).toBe('/users/check-exists/email/');
});

test('email is required', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPost('/users/check-exists/email/').reply(200, { exists: false });
  mock.onPatch('/users/profile/').reply(200, fixtures.user);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Email'));
  });
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText('Email required')).toBeInTheDocument();
  });
  expect(mock.history.patch).toHaveLength(0);
});

test('email should be valid', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPost('/users/check-exists/email/').reply(200, { exists: false });
  mock.onPatch('/users/profile/').reply(200, fixtures.user);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'foo');
  });
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  expect(mock.history.patch).toHaveLength(0);
});

test('handles API error when fetching profile', async () => {
  mock.onGet('/users/profile/').reply(500, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

test('handles API error when update fails', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(500, {});
  mock.onPost('/users/check-exists/email/').reply(200, { exists: false });
  const mockNotificationError = jest.spyOn(notification, 'error');

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'tyrabanks@example.com');
  });
  await user.click(screen.getByText('Submit'));
  expect(mock.history.patch).toHaveLength(1);
  expect(mock.history.patch[0].url).toBe('/users/profile/');
  expect(mockNotificationError).toHaveBeenCalledWith({
    message: 'Something went wrong!',
    description: 'Try again later',
  });
});
