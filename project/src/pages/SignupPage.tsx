import React from 'react';
import { Navigate } from 'react-router-dom';
import SignupForm from '../components/Auth/SignupForm';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;