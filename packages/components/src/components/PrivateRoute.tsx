// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Navigate } from 'react-router-dom';

export interface PrivateRouteProps {
  isAuthenticated: boolean;
  authenticationPath: string;
  component: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  authenticationPath,
  component,
}: PrivateRouteProps) => {
  return isAuthenticated ? component : <Navigate to={authenticationPath} />;
};

export { PrivateRoute };
