import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';

function Login() {
  useEffect(() => {
    // Wait for SDK to be available
    const checkSDK = setInterval(() => {
      if (window.ApperSDK) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showLogin("#authentication");
        clearInterval(checkSDK);
      }
    }, 100);

    return () => clearInterval(checkSDK);
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-surface rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-accent to-red-600 text-white text-2xl 2xl:text-3xl font-bold">
            S
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Sign in to Shoppers Stop
            </div>
            <div className="text-center text-sm text-gray-500">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-accent hover:text-red-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;