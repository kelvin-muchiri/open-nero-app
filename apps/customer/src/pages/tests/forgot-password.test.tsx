import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordPage from '../forgot-password';
import { Providers } from '../../helpers/test-utils';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockUseNavigate,
  };
});

test('renders correctly', async () => {
  const user = userEvent.setup();
  render(<ForgotPasswordPage />, { wrapper: Providers });
  expect(screen.queryByRole('heading', { level: 3 })).toHaveTextContent('Forgot Password');
  expect(screen.queryByLabelText('Email')).toBeInTheDocument();
  expect(screen.queryByText('Submit')).toBeInTheDocument();
  await user.click(screen.getByText(/Back to sign in/i));
  expect(mockUseNavigate).toHaveBeenCalledWith('/');
});
