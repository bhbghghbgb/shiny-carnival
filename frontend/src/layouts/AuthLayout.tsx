import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default AuthLayout;

