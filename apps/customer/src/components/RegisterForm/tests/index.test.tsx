import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import { RegisterForm } from '..';
import { apiService } from '../../../services/api';

const mock = new MockAdapter(apiService.getAxiosInstance());
const mockUseNavigate = jest.fn();

jest.setTimeout(30000);

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockUseNavigate,
  };
});

jest.mock('react-google-recaptcha-v3', () => {
  const originalModule = jest.requireActual('react-google-recaptcha-v3');

  return {
    __esModule: true,
    ...originalModule,
    useGoogleReCaptcha: () => {
      return {
        executeRecaptcha: () => Promise.resolve('mocked-recaptcha-token'),
      };
    },
  };
});

afterEach(() => {
  mock.reset();
});

const createEndpoint = '/users/customers/create/';
const existsEndpoint = '/users/check-exists/email/';
const recaptchaEndpint = '/auth/google-recaptcha/';
const email = 'janedoe@example.com';
const fullName = 'Jane Doe';
const password = 'password123';

test('renders correctly', async () => {
  const user = userEvent.setup();
  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  expect(screen.getByText('Submit')).toBeInTheDocument();
  await user.click(screen.getByText(/sign in/i));
  expect(mockUseNavigate).toHaveBeenCalledWith('/sign-in');
});

test('submits correctly', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });
  mock.onPost(recaptchaEndpint).reply(200, { success: true });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  const fullNameInput = screen.getByLabelText('Full Name');
  await user.type(fullNameInput, fullName);

  const emailInput = screen.getByLabelText('Email');
  await user.type(emailInput, email);

  const passwordInput = screen.getByLabelText('Password');
  await user.type(passwordInput, password);

  const confirmInput = screen.getByLabelText('Confirm Password');
  await user.type(confirmInput, password);
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(4);
  // called on blur
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[0].data).toBe(
    JSON.stringify({ email: email, profile_type: 'CUSTOMER' })
  );
  // called on submit
  expect(mock.history.post[1].url).toBe(existsEndpoint);
  expect(mock.history.post[1].data).toBe(
    JSON.stringify({ email: email, profile_type: 'CUSTOMER' })
  );
  expect(mock.history.post[2].url).toBe(recaptchaEndpint);
  expect(mock.history.post[2].data).toBe(JSON.stringify({ token: 'mocked-recaptcha-token' }));
  expect(mock.history.post[3].url).toBe(createEndpoint);
  expect(mock.history.post[3].data).toBe(
    JSON.stringify({
      full_name: fullName,
      password: password,
      confirm_password: password,
      email,
    })
  );
  expect(screen.getByText(/you have signed up successfully/i)).toBeInTheDocument();
  await user.click(screen.getByText(/sign in/i));
  expect(mockUseNavigate).toHaveBeenCalledWith('/sign-in');
});

test('full name is required', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Confirm Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/full name required/i)).toBeInTheDocument();
  });
  // user not created
  expect(mock.history.post).toHaveLength(2);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(existsEndpoint);
});

test('full name max length is 71 chars', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });
  mock.onPost(recaptchaEndpint).reply(200, { success: true });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );
  const invalidName = 'Lorem ipsum dolor sit ametp consectetur adipiscing elito sed do eiusmodt';

  expect(invalidName).toHaveLength(72);

  const fullNameInput = screen.getByLabelText('Full Name');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const confirmInput = screen.getByLabelText('Confirm Password');

  await user.type(fullNameInput, invalidName);
  await user.type(emailInput, email);
  await user.type(passwordInput, password);
  await user.type(confirmInput, password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/maximum length is 71 characters/i)).toBeInTheDocument();
  // user not created
  expect(mock.history.post).toHaveLength(2);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(existsEndpoint);

  // changing to 71 chars passes
  mock.resetHistory();

  const validName = invalidName.slice(0, -1);
  expect(validName).toHaveLength(71);

  await user.clear(fullNameInput);
  await user.type(fullNameInput, validName);
  expect(fullNameInput).toHaveValue(validName);
  await user.click(screen.getByText('Submit'));
  // user is created
  expect(mock.history.post).toHaveLength(3);
  // called on blur
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  // called on submit
  expect(mock.history.post[1].url).toBe(recaptchaEndpint);
  expect(mock.history.post[1].data).toBe(JSON.stringify({ token: 'mocked-recaptcha-token' }));
  expect(mock.history.post[2].url).toBe(createEndpoint);
});

test('full name is valid', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  //  name cannot end with special char
  await waitFor(async () => {
    await user.clear(screen.getByLabelText('Full Name'));
    await user.type(screen.getByLabelText('Full Name'), 'Tyra.');
  });
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(
      screen.getByText(
        'Full Name can only contain alphabets, spaces, periods, hyphens and apostrophes. Can only begin and end with alphabet'
      )
    ).toBeInTheDocument();
  });
  // name cannot start with special char
  await user.clear(screen.getByLabelText('Full Name'));
  await user.type(screen.getByLabelText('Full Name'), '-Tyra');
  await user.click(screen.getByText('Submit'));
  expect(
    screen.getByText(
      'Full Name can only contain alphabets, spaces, periods, hyphens and apostrophes. Can only begin and end with alphabet'
    )
  ).toBeInTheDocument();
  // name cannot contain numbers
  await user.clear(screen.getByLabelText('Full Name'));
  await user.type(screen.getByLabelText('Full Name'), 'Tyra56');
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(
      screen.getByText(
        'Full Name can only contain alphabets, spaces, periods, hyphens and apostrophes. Can only begin and end with alphabet'
      )
    ).toBeInTheDocument();
  });
});

test('password is required', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  await user.type(screen.getByLabelText('Full Name'), fullName);
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Confirm Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/password required/i)).toBeInTheDocument();
  });
  // user not created
  expect(mock.history.post).toHaveLength(2);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(existsEndpoint);
});

test('password min length is 6 chars', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });
  mock.onPost(recaptchaEndpint).reply(200, { success: true });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );
  const invalidPassword = 'Lorem';

  expect(invalidPassword).toHaveLength(5);

  const fullNameInput = screen.getByLabelText('Full Name');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const confirmInput = screen.getByLabelText('Confirm Password');

  await user.type(fullNameInput, fullName);
  await user.type(emailInput, email);
  await user.type(passwordInput, invalidPassword);
  await user.type(confirmInput, invalidPassword);
  await user.click(screen.getByText('Submit'));
  // user not created
  expect(screen.getByText(/minimum length is 6 characters/i)).toBeInTheDocument();
  expect(mock.history.post).toHaveLength(2);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(existsEndpoint);

  // updating to 6 chars passes
  mock.resetHistory();

  const validPassword = invalidPassword + 'a';
  expect(validPassword).toHaveLength(6);

  await user.clear(passwordInput);
  await user.clear(confirmInput);
  await user.type(passwordInput, validPassword);
  await user.type(confirmInput, validPassword);
  expect(passwordInput).toHaveValue(validPassword);
  expect(confirmInput).toHaveValue(validPassword);
  await user.click(screen.getByText('Submit'));
  // user created
  expect(mock.history.post).toHaveLength(3);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(recaptchaEndpint);
  expect(mock.history.post[1].data).toBe(JSON.stringify({ token: 'mocked-recaptcha-token' }));
  expect(mock.history.post[2].url).toBe(createEndpoint);
});

test('password max length is 255 chars', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });
  mock.onPost(recaptchaEndpint).reply(200, { success: true });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );
  const invalidPassword =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure doloruii';

  expect(invalidPassword).toHaveLength(256);

  const fullNameInput = screen.getByLabelText('Full Name');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const confirmInput = screen.getByLabelText('Confirm Password');

  await user.type(fullNameInput, fullName);
  await user.type(emailInput, email);
  await user.type(passwordInput, invalidPassword);
  await user.type(confirmInput, invalidPassword);
  await user.click(screen.getByText('Submit'));

  // user not created
  await waitFor(() => {
    expect(screen.getByText(/maximum length is 255 characters/i)).toBeInTheDocument();
  });
  expect(mock.history.post).toHaveLength(2);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(existsEndpoint);

  // updating to 6 chars passes
  mock.resetHistory();

  const validPassword = invalidPassword.slice(0, -1);
  expect(validPassword).toHaveLength(255);

  await user.clear(passwordInput);
  await user.clear(confirmInput);
  await user.type(passwordInput, validPassword);
  await user.type(confirmInput, validPassword);
  expect(passwordInput).toHaveValue(validPassword);
  expect(confirmInput).toHaveValue(validPassword);
  await user.click(screen.getByText('Submit'));
  // user created
  expect(mock.history.post).toHaveLength(3);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(recaptchaEndpint);
  expect(mock.history.post[1].data).toBe(JSON.stringify({ token: 'mocked-recaptcha-token' }));
  expect(mock.history.post[2].url).toBe(createEndpoint);
});

test('confirm password should match password', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  await user.type(screen.getByLabelText('Full Name'), fullName);
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Confirm Password'), 'foo');
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(
      screen.getByText(/the two passwords that you entered do not match/i)
    ).toBeInTheDocument();
  });
  // user not created
  expect(mock.history.post).toHaveLength(2);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(existsEndpoint);
});

test('email is required', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  await user.type(screen.getByLabelText('Full Name'), fullName);
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Confirm Password'), password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/email required/i)).toBeInTheDocument();
  });
  // user not created, email exists check waits until a valid email is entered
  expect(mock.history.post).toHaveLength(0);
});

test('email should be valid', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  await user.type(screen.getByLabelText('Full Name'), fullName);
  await user.type(screen.getByLabelText('Email'), 'foo');
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Confirm Password'), password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  // user not created, email exists check waits until a valid email is entered
  expect(mock.history.post).toHaveLength(0);
});

test('email should be unique', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: true });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  await user.type(screen.getByLabelText('Full Name'), fullName);
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Confirm Password'), password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/an account with that email already exists/i)).toBeInTheDocument();
  // user not created
  expect(mock.history.post).toHaveLength(2);
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[1].url).toBe(existsEndpoint);
});

test('displays server validation errors', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(400, {
    non_field_errors: ['passwords do not match'],
    full_name: ['Invalid full name'],
    email: ['Invalid email'],
    password: ['Invalid password'],
    confirm_password: ['Invalid confirm password'],
  });
  mock.onPost(existsEndpoint).reply(200, { exists: false });
  mock.onPost(recaptchaEndpint).reply(200, { success: true });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  const fullNameInput = screen.getByLabelText('Full Name');
  await user.type(fullNameInput, fullName);

  const emailInput = screen.getByLabelText('Email');
  await user.type(emailInput, email);

  const passwordInput = screen.getByLabelText('Password');
  await user.type(passwordInput, password);

  const confirmInput = screen.getByLabelText('Confirm Password');
  await user.type(confirmInput, password);
  await user.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid full name/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid password/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid confirm password/i)).toBeInTheDocument();
  });
});

test('handles unknown server error', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(500);
  mock.onPost(existsEndpoint).reply(200, { exists: false });
  mock.onPost(recaptchaEndpint).reply(200, { success: true });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  const fullNameInput = screen.getByLabelText('Full Name');
  await user.type(fullNameInput, fullName);

  const emailInput = screen.getByLabelText('Email');
  await user.type(emailInput, email);

  const passwordInput = screen.getByLabelText('Password');
  await user.type(passwordInput, password);

  const confirmInput = screen.getByLabelText('Confirm Password');
  await user.type(confirmInput, password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/something went wrong!/i)).toBeInTheDocument();
});

test('handles google recaptcha validation failure', async () => {
  const user = userEvent.setup();
  mock.onPost(createEndpoint).reply(200);
  mock.onPost(existsEndpoint).reply(200, { exists: false });
  mock.onPost(recaptchaEndpint).reply(200, { success: false });

  render(
    <BrowserRouter>
      <RegisterForm urlSignIn="/sign-in" />
    </BrowserRouter>
  );

  const fullNameInput = screen.getByLabelText('Full Name');
  await user.type(fullNameInput, fullName);

  const emailInput = screen.getByLabelText('Email');
  await user.type(emailInput, email);

  const passwordInput = screen.getByLabelText('Password');
  await user.type(passwordInput, password);

  const confirmInput = screen.getByLabelText('Confirm Password');
  await user.type(confirmInput, password);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText(/something went wrong!/i)).toBeInTheDocument();
  expect(mock.history.post).toHaveLength(3);
  // called on blur
  expect(mock.history.post[0].url).toBe(existsEndpoint);
  expect(mock.history.post[0].data).toBe(
    JSON.stringify({ email: email, profile_type: 'CUSTOMER' })
  );
  // called on submit, user is not created
  expect(mock.history.post[1].url).toBe(existsEndpoint);
  expect(mock.history.post[1].data).toBe(
    JSON.stringify({ email: email, profile_type: 'CUSTOMER' })
  );
  expect(mock.history.post[2].url).toBe(recaptchaEndpint);
  expect(mock.history.post[2].data).toBe(JSON.stringify({ token: 'mocked-recaptcha-token' }));
});
