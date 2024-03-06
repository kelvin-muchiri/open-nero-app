import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPasswordPage from '../reset-password';
import MockAdapter from 'axios-mock-adapter';
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
    useRouteMatch: () => ({ url: '/reset-password/uidb64/token' }),
  };
});

test('renders correctly', () => {
  render(<ResetPasswordPage />, { wrapper: Providers });
  expect(screen.queryByRole('heading', { level: 3 })).toHaveTextContent('Reset Password');
  expect(screen.queryByLabelText('New Password')).toBeInTheDocument();
  expect(screen.queryByLabelText('Confirm New Password')).toBeInTheDocument();
  expect(screen.getByText('Submit')).toBeInTheDocument();
});

test('displays success message after resetting password', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/end/').reply(200, {});
  render(<ResetPasswordPage />, { wrapper: Providers });
  await user.type(screen.getByLabelText('New Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm New Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/reset-password/end/');
  await waitFor(() => {
    expect(screen.getByText(/your password has been changed successfully/i)).toBeInTheDocument();
  });
  await user.click(screen.getByText('Sign in'));
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/');
});

test('displays message if activation credentials are invalid', async () => {
  const user = userEvent.setup();
  mock.onPost('/users/reset-password/end/').reply(400, {
    non_field_errors: ['Invalid activation credentials'],
  });
  render(<ResetPasswordPage />, { wrapper: Providers });
  await user.type(screen.getByLabelText('New Password'), 'password123');
  await user.type(screen.getByLabelText('Confirm New Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.post[0].url).toBe('/users/reset-password/end/');
  await waitFor(() => {
    expect(screen.getByText(/your password reset link is expired or invalid/i)).toBeInTheDocument();
  });
  await user.click(screen.getByText('Request new link'));
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/forgot');
});
