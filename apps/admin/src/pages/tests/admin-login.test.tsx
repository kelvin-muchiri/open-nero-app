import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { AdminLoginPage } from '../admin-login';
import { apiService } from '../../services/api';
import { Providers } from '../../helpers/test-utils';

const mockUseNavigate = jest.fn();
const mockAPI = new MockAdapter(apiService.getAxiosInstance());
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockUseNavigate,
  };
});

beforeAll(() => {
  Storage.prototype.setItem = mockSetItem;
  Storage.prototype.getItem = mockGetItem;
});

afterEach(() => {
  mockAPI.reset();
});

test('renders correctly', async () => {
  const user = userEvent.setup();
  render(<AdminLoginPage />, { wrapper: Providers });

  expect(screen.queryByRole('heading', { level: 3 })).toHaveTextContent('Sign in');
  expect(screen.queryByLabelText('Email')).toBeInTheDocument();
  expect(screen.queryByLabelText('Password')).toBeInTheDocument();
  expect(screen.queryByLabelText('Remember me')).toBeInTheDocument();
  expect(screen.queryByText('Submit')).toBeInTheDocument();
  expect(screen.queryByText('Forgot password')).toBeInTheDocument();
  await user.click(screen.getByText('Forgot password'));
  expect(mockUseNavigate).toHaveBeenCalledWith('/forgot-password');
});

test('submits correctly', async () => {
  const user = userEvent.setup();
  mockAPI.onPost('/auth/token/').reply(200, {});

  render(<AdminLoginPage />, { wrapper: Providers });

  await user.type(screen.getByLabelText('Email'), 'jandedoe@example.com');
  await user.type(screen.getByLabelText('Password'), 'password123');
  await user.click(screen.getByText('Submit'));
  expect(mockAPI.history.post).toHaveLength(1);
  expect(mockAPI.history.post[0].data).toBe(
    JSON.stringify({
      username: 'jandedoe@example.com',
      password: 'password123',
      profile_type: 'STAFF',
    })
  );
  expect(mockAPI.history.post[0].url).toBe('/auth/token/');
  expect(mockUseNavigate).toHaveBeenLastCalledWith('/pages');
  expect(mockSetItem).toHaveBeenNthCalledWith(1, 'rememberMe', 'true');
  expect(mockSetItem).toHaveBeenNthCalledWith(2, 'isUserLogged', 'true');
});
