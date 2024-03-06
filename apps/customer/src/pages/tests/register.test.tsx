import { render, screen } from '@testing-library/react';
import RegisterPage from '../register';
import { Providers } from '../../helpers/test-utils';

test('renders correctly', () => {
  render(<RegisterPage urlSignIn="/sign-in" />, { wrapper: Providers });

  expect(screen.queryByRole('heading', { level: 3 })).toHaveTextContent('Sign up');
  expect(screen.queryByLabelText('Full Name')).toBeInTheDocument();
  expect(screen.queryByLabelText('Email')).toBeInTheDocument();
  expect(screen.queryByLabelText('Password')).toBeInTheDocument();
  expect(screen.queryByLabelText('Confirm Password')).toBeInTheDocument();
  expect(screen.queryByText('Submit')).toBeInTheDocument();
});
