import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import { notification } from 'antd';
import { store } from '../../../store/store';
import { Profile } from '..';
import * as fixtures from './fixtures';
import { BrowserRouter } from 'react-router-dom';
import { apiService, queryService } from '../../../services/api';

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
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('First Name')).toBeInTheDocument();
    expect(screen.queryByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.queryByLabelText('Email')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).toBeInTheDocument();
  });
  // submit button is disabled until form is edited
  await user.click(screen.getByText('Submit'));
  expect(mock.history.patch).toHaveLength(0);
});

test('edits profile', async () => {
  const user = userEvent.setup();
  mock
    .onGet('/users/profile/')
    .replyOnce(200, fixtures.user)
    .onGet('/users/profile/')
    // mock rtk query fetch after submission
    // new email is no included in mock because backend does not update
    // email until email is verified
    .replyOnce(200, {
      ...fixtures.user,
      first_name: 'Tyra',
      last_name: 'Banks',
      full_name: 'Tyra Banks',
    });
  mock.onPatch('/users/profile/').reply(200, {});
  mock.onPost('/users/check-exists/email/').reply(200, { exists: false });
  mock
    .onGet('/users/verify/email/resend/')
    .replyOnce(200)
    .onGet('/users/verify/email/resend/')
    .replyOnce(500);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(
    async () => {
      await user.clear(screen.getByLabelText('First Name'));
      await user.type(screen.getByLabelText('First Name'), 'Tyra');
      await user.clear(screen.getByLabelText('Last Name'));
      await user.type(screen.getByLabelText('Last Name'), 'Banks');
      await user.clear(screen.getByLabelText('Email'));
      await user.type(screen.getByLabelText('Email'), 'tyrabanks@example.com');
    },
    { timeout: 3000 }
  );

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
      first_name: 'Tyra',
      last_name: 'Banks',
      email: 'tyrabanks@example.com',
    })
  );
  // rtk query refetches new profile data
  expect(mock.history.get[1].url).toBe('/users/profile/');
  await waitFor(() => {
    expect(screen.getByText(/Success/i)).toBeInTheDocument();
  });
  // the email changed so we show email verifictation message
  expect(
    screen.getByText(
      /A verification link has been sent to your new email. Please click on that link to verify and update your email. Check the spam folder incase the email was incorrectly identfied/i
    )
  ).toBeInTheDocument();
  expect(screen.queryByText("I haven't received a link, Please resend")).toBeInTheDocument();
  // submit button is disabled.
  await user.click(screen.getByText('Submit'));
  //  no extra call is made to edit API
  expect(mock.history.patch).toHaveLength(1);

  // resend email link works
  const mockNotificationSuccess = jest.spyOn(notification, 'success');
  await user.click(screen.getByText("I haven't received a link, Please resend"));
  expect(mock.history.get[2].url).toBe('/users/verify/email/resend/');
  expect(mockNotificationSuccess).toHaveBeenCalledWith({
    message: 'Verification link sent',
  });

  // handles email resend API error
  const mockNotificationError = jest.spyOn(notification, 'error');
  await user.click(screen.getByText("I haven't received a link, Please resend"));
  expect(mock.history.get[3].url).toBe('/users/verify/email/resend/');
  expect(mockNotificationError).toHaveBeenCalledWith({
    message: 'Something went wrong!',
    description: 'Try again later',
  });
});

test('no email verification message shown if email does not change', async () => {
  jest.setTimeout(10000);
  const user = userEvent.setup();
  mock
    .onGet('/users/profile/')
    .replyOnce(200, fixtures.user)
    .onGet('/users/profile/')
    // mock rtk query fetch after submission
    // new email is no included in mock because backend does not update
    // email until email is verified
    .replyOnce(200, {
      ...fixtures.user,
      first_name: 'Tyra',
      last_name: 'Banks',
      full_name: 'Tyra Banks',
    });
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('First Name'));
  });
  await user.type(screen.getByLabelText('First Name'), 'Tyra');
  await user.clear(screen.getByLabelText('Last Name'));
  await user.type(screen.getByLabelText('Last Name'), 'Banks');
  await user.click(screen.getByText('Submit'));
  await waitFor(
    () => {
      expect(mock.history.post).toHaveLength(1);
      // called on submit
      expect(mock.history.post[0].url).toBe('/users/check-exists/email/');
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe('/users/profile/');
      JSON.stringify({
        first_name: 'Tyra',
        last_name: 'Banks',
        email: fixtures.user.email,
      });
      // rtk query refetches new profile data
      expect(mock.history.get[1].url).toBe('/users/profile/');
      expect(screen.getByText(/Success/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/a verification link has been sent to your new email/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/I haven't received a link, Please resend/i)
      ).not.toBeInTheDocument();
    },
    { timeout: 5000 }
  );
});

test('first name is required', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('First Name'));
  });

  await user.click(screen.getByText('Submit'));
  expect(screen.getByText('First Name required')).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(0);
});

test('first name max length is 35 chars', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  // first name 36 chars fails
  const nameInvalid = 'Loremipsumdolorsitametconsectueiusmo';
  expect(nameInvalid).toHaveLength(36);
  await waitFor(
    async () => {
      await user.clear(screen.getByLabelText('First Name'));
      await user.type(screen.getByLabelText('First Name'), nameInvalid);
    },
    { timeout: 3000 }
  );

  await user.click(screen.getByText('Submit'));
  expect(screen.getByText('Maximum length is 35 characters')).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(0);

  // 35 chars passes
  const nameValid = nameInvalid.slice(0, -1);
  expect(nameValid).toHaveLength(35);
  await user.clear(screen.getByLabelText('First Name'));
  await user.type(screen.getByLabelText('First Name'), nameValid);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/Success/i)).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(1);
  expect(mock.history.patch[0].url).toBe('/users/profile/');
  expect(mock.history.patch[0].data).toEqual(
    JSON.stringify({
      first_name: nameValid,
      last_name: fixtures.user.last_name,
      email: fixtures.user.email,
    })
  );
});

test('first name is valid', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  //  name cannot end with special char
  await waitFor(async () => {
    await user.clear(screen.getByLabelText('First Name'));
    await user.type(screen.getByLabelText('First Name'), 'Tyra.');
  });

  await user.click(screen.getByText('Submit'));
  expect(
    screen.getByText(
      'First Name can only contain alphabets, periods, hyphens and apostrophes. Can only begin and end with alphabet'
    )
  ).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(0);
  // name cannot start with special char
  await user.clear(screen.getByLabelText('First Name'));
  await user.type(screen.getByLabelText('First Name'), '-Tyra');
  await user.click(screen.getByText('Submit'));
  expect(
    screen.getByText(
      'First Name can only contain alphabets, periods, hyphens and apostrophes. Can only begin and end with alphabet'
    )
  ).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(0);
  // name cannot contain numbers
  await user.clear(screen.getByLabelText('First Name'));
  await user.type(screen.getByLabelText('First Name'), 'Tyra56');
  await user.click(screen.getByText('Submit'));
  expect(
    screen.getByText(
      'First Name can only contain alphabets, periods, hyphens and apostrophes. Can only begin and end with alphabet'
    )
  ).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(0);
});

test('last name is optional', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Last Name'));
  });

  await user.click(screen.getByText('Submit'));
  expect(mock.history.patch).toHaveLength(1);
  expect(mock.history.patch[0].url).toBe('/users/profile/');
  expect(mock.history.patch[0].data).toBe(
    JSON.stringify({
      first_name: fixtures.user.first_name,
      last_name: '',
      email: fixtures.user.email,
    })
  );
});

test('last name max length is 35 chars', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );
  // first name 36 chars fails
  const nameInvalid = 'Loremipsumdolorsitametconsectueiusmo';
  expect(nameInvalid).toHaveLength(36);
  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Last Name'));
    await user.type(screen.getByLabelText('Last Name'), nameInvalid);
  });
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText('Maximum length is 35 characters')).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(0);

  // 35 chars passes
  const nameValid = nameInvalid.slice(0, -1);
  expect(nameValid).toHaveLength(35);
  await user.clear(screen.getByLabelText('Last Name'));
  await user.type(screen.getByLabelText('Last Name'), nameValid);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/Success/i)).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(1);
  expect(mock.history.patch[0].url).toBe('/users/profile/');
  expect(mock.history.patch[0].data).toEqual(
    JSON.stringify({
      first_name: fixtures.user.first_name,
      last_name: nameValid,
      email: fixtures.user.email,
    })
  );
});

test('last name is valid', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  //  name cannot end with special char
  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Last Name'));
    await user.type(screen.getByLabelText('Last Name'), 'Tyra.');
  });
  await user.click(screen.getByText('Submit'));

  expect(
    screen.getByText(
      'Last Name can only contain alphabets, periods, hyphens and apostrophes. Can only begin and end with alphabet'
    )
  ).toBeInTheDocument();

  expect(mock.history.patch).toHaveLength(0);
  // name cannot start with special char
  await user.clear(screen.getByLabelText('Last Name'));
  await user.type(screen.getByLabelText('Last Name'), '-Tyra');
  await user.click(screen.getByText('Submit'));

  expect(
    screen.getByText(
      'Last Name can only contain alphabets, periods, hyphens and apostrophes. Can only begin and end with alphabet'
    )
  ).toBeInTheDocument();

  expect(mock.history.patch).toHaveLength(0);
  // name cannot contain numbers
  await user.clear(screen.getByLabelText('Last Name'));
  await user.type(screen.getByLabelText('Last Name'), 'Tyra56');
  await user.click(screen.getByText('Submit'));
  expect(
    screen.getByText(
      'Last Name can only contain alphabets, periods, hyphens and apostrophes. Can only begin and end with alphabet'
    )
  ).toBeInTheDocument();
  expect(mock.history.patch).toHaveLength(0);
});

test('email is required', async () => {
  const user = userEvent.setup();
  mock.onGet('/users/profile/').reply(200, fixtures.user);
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
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
  mock.onPatch('/users/profile/').reply(200, {});

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
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
        <Profile />
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
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('First Name'));
    await user.type(screen.getByLabelText('First Name'), 'Tyra');
  });
  await user.click(screen.getByText('Submit'));
  expect(mock.history.patch).toHaveLength(1);
  expect(mock.history.patch[0].url).toBe('/users/profile/');
  expect(mockNotificationError).toHaveBeenCalledWith({ message: 'Something went wrong!' });
});

test('incase update fails after successful update, success message is cleared', async () => {
  const user = userEvent.setup();
  mock
    .onGet('/users/profile/')
    .replyOnce(200, fixtures.user)
    .onGet('/users/profile/')
    // mock rtk query fetch after submission
    // new email is no included in mock because backend does not update
    // email until email is verified
    .replyOnce(200, {
      ...fixtures.user,
      first_name: 'Tyra',
      full_name: 'Tyra Doe',
    })
    .onGet('/users/profile/')
    .replyOnce(200, {
      ...fixtures.user,
      first_name: 'Niki',
      full_name: 'Niki Doe',
    });
  mock.onPatch('/users/profile/').replyOnce(200, {}).onPut('/users/profile/').replyOnce(500, {});
  mock.onPost('/users/check-exists/email/').reply(200, { exists: false });
  const mockNotificationError = jest.spyOn(notification, 'error');

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );

  await waitFor(async () => {
    await user.clear(screen.getByLabelText('First Name'));
    await user.type(screen.getByLabelText('First Name'), 'Tyra');
  });
  await user.click(screen.getByText('Submit'));
  expect(mock.history.patch).toHaveLength(1);
  expect(mock.history.patch[0].url).toBe('/users/profile/');
  expect(screen.getByText(/Success/i)).toBeInTheDocument();

  // now we submit again
  await user.clear(screen.getByLabelText('First Name'));
  await user.type(screen.getByLabelText('First Name'), 'Niki');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.patch).toHaveLength(2);
  expect(mockNotificationError).toHaveBeenCalledWith({ message: 'Something went wrong!' });
  expect(screen.queryByText(/Success/i)).not.toBeInTheDocument();
});
