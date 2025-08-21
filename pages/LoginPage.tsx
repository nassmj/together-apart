import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';
import { loginSchema, validateForm, sanitizeString, type LoginFormData } from '../lib/validation';
import { LoadingButton } from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: sanitizeString(value)
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const validation = validateForm(loginSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrors({ form: error.message });
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrors({ form: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-white/5 p-10 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Continue your connection journey
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.form && <p className="text-center text-sm text-red-500">{errors.form}</p>}
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-3 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-pink focus:ring-pink'
                }`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="relative">
              <label htmlFor="password-login" className="sr-only">
                Password
              </label>
              <input
                id="password-login"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-3 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-pink focus:ring-pink'
                }`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
               <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
            </div>
             {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a href="#" className="font-medium text-pink hover:text-pink/80">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              loadingText="Signing In..."
              className="w-full bg-green text-black hover:bg-opacity-90 focus:ring-green focus:ring-offset-white dark:focus:ring-offset-black"
            >
              Sign In
            </LoadingButton>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-pink hover:text-pink/80">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;