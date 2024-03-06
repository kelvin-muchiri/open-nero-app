import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyEmailPage from '../verify-email';
import MockAdapter from 'axios-mock-adapter';
import { notification } from 'antd';
import { apiService } from '../../services/api';
import { Providers } from '../../helpers/test-utils';

const mock = new MockAdapter(apiService.getAxiosInstance());
const mockUseNavigate = jest.fn();

afterEach(() => {
  mock.reset();
});

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockUseNavigate,
    useParams: () => ({
      uidb64: 'uidb64',
      token: 'token',
    }),
    useRouteMatch: () => ({ url: '/verify-email/uidb64/token' }),
  };
});

test('displays success message if email  verified', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/verify/email/').reply(200, {});
  render(<VerifyEmailPage />, { wrapper: Providers });
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/verify/email/');
  await user.click(screen.getByText('Home'));
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/');
});

test('displays message if credentials are invalid', async () => {
  mock.onPost('/users/verify/email/').reply(400, {
    non_field_errors: ['Invalid activation credentials'],
  });
  mock.onGet('/users/verify/email/resend/').reply(200, {});

  render(<VerifyEmailPage />, { wrapper: Providers });
  await waitFor(() => {
    expect(
      screen.getByText(/your email verification link is expired or invalid/i)
    ).toBeInTheDocument();
  });
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/verify/email/');
  expect(screen.getByText('Request new link')).toBeInTheDocument();
});

test('handles API errors', async () => {
  mock.onPost('/users/verify/email/').reply(500, {});
  render(<VerifyEmailPage />, { wrapper: Providers });
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/try again later/i)).toBeInTheDocument();
  });
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/verify/email/');
});

test('resend email verification link works', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/verify/email/').reply(400, {
    non_field_errors: ['Invalid activation credentials'],
  });
  mock.onGet('/users/verify/email/resend/').reply(200, {});

  render(<VerifyEmailPage />, { wrapper: Providers });

  await waitFor(() => {
    expect(
      screen.getByText(/your email verification link is expired or invalid/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Request new link')).toBeInTheDocument();
  });
  await user.click(screen.getByText('Request new link'));
  expect(mock.history.get).toHaveLength(1);
  expect(mock.history.get[0].url).toBe('/users/verify/email/resend/');
  expect(
    screen.getByText(
      'A verification link has been sent to your new email. Please click on that link to verify and update your email. Check the spam folder incase the email was incorrectly identfied'
    )
  ).toBeInTheDocument();
  // invalid link message disappears
  expect(
    screen.queryByText(/your email verification link is expired or invalid/i)
  ).not.toBeInTheDocument();
});

test('handles resend link API error', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/verify/email/').reply(400, {
    non_field_errors: ['Invalid activation credentials'],
  });
  mock.onGet('/users/verify/email/resend/').reply(500, {});
  const mockNotificationError = jest.spyOn(notification, 'error');

  render(<VerifyEmailPage />, { wrapper: Providers });

  await waitFor(async () => {
    await user.click(screen.getByText('Request new link'));
  });
  expect(mock.history.get).toHaveLength(1);
  expect(mock.history.get[0].url).toBe('/users/verify/email/resend/');
  expect(mockNotificationError).toHaveBeenCalledWith({
    message: 'Something went wrong!',
    description: 'Try again later',
  });
  // link is still available so that user could try again
  expect(screen.queryByText('Request new link')).toBeInTheDocument();
});
