import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';


const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const getStrength = () => {
        let score = 0;
        if (password.length > 7) score++;
        if (password.length > 11) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength();
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength] || '';
    const color = ['bg-pink-500/50', 'bg-pink', 'bg-green/50', 'bg-green/80', 'bg-green'][strength -1] || 'bg-gray-200 dark:bg-gray-700';
    const textColor = strength > 2 ? 'text-green' : 'text-pink';
    const width = `${(strength / 5) * 100}%`;

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-gray-600 dark:text-gray-300">Password Strength</span>
                <span className={`font-semibold ${textColor}`}>{strengthText}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-black/50 rounded-full h-2">
                <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width }}></div>
            </div>
        </div>
    );
};

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const inviteCode = location.state?.inviteCode;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (validate()) {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            avatar_url: `https://i.pravatar.cc/150?u=${formData.email}`,
          },
        },
      });
      
      if (error) {
        setErrors({ form: error.message });
        toast.error(error.message);
        setIsLoading(false);
      } else if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
            toast.error("User with this email already exists.");
            setErrors({ email: "User with this email already exists." });
            setIsLoading(false);
        } else {
            if (inviteCode) {
              const { error: rpcError } = await supabase.rpc('accept_invite', { invite_code: inviteCode });
              if (rpcError) {
                  toast.error(`Account created, but failed to connect: ${rpcError.message}`);
              } else {
                  toast.success("Success! You are now connected with your partner.");
              }
            } else {
              toast.success('Success! Please check your email to confirm your account.');
            }
            navigate('/login');
            setIsLoading(false);
        }
      }
    }
  };

  const getInputClasses = (field: string) => `relative block w-full appearance-none rounded-md border px-3 py-3 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
      errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-pink focus:ring-pink'
  }`;

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-white/5 p-10 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {inviteCode ? "You're Almost Connected!" : "Create Your Account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
             {inviteCode ? "Just create your account to link with your partner." : "Start your journey to deeper connection"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.form && <p className="text-center text-sm text-red-500">{errors.form}</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="full-name" className="font-medium text-gray-700 dark:text-gray-300 sr-only">Full Name</label>
              <input id="full-name" name="fullName" type="text" required placeholder="Full Name"
                className={getInputClasses('fullName')}
                value={formData.fullName} onChange={handleChange} />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>
            
            <div>
              <label htmlFor="email-signup" className="font-medium text-gray-700 dark:text-gray-300 sr-only">Email address</label>
              <input id="email-signup" name="email" type="email" autoComplete="email" required placeholder="Email address"
                className={getInputClasses('email')}
                value={formData.email} onChange={handleChange} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div className="relative">
              <label htmlFor="password-signup" className="font-medium text-gray-700 dark:text-gray-300 sr-only">Password</label>
              <input id="password-signup" name="password" type={showPassword ? 'text' : 'password'} required placeholder="Create a password"
                autoComplete="new-password"
                className={getInputClasses('password')}
                value={formData.password} onChange={handleChange} />
                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            <PasswordStrengthIndicator password={formData.password} />

            <div className="relative">
              <label htmlFor="confirm-password" className="font-medium text-gray-700 dark:text-gray-300 sr-only">Confirm Password</label>
              <input id="confirm-password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required placeholder="Confirm your password"
                autoComplete="new-password"
                className={getInputClasses('confirmPassword')}
                value={formData.confirmPassword} onChange={handleChange} />
                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-green py-2 px-4 text-sm font-bold text-black hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black disabled:opacity-50"
            >
             {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (inviteCode ? 'Create Account & Connect' : 'Create Account')}
            </button>
          </div>
        </form>
         <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-pink hover:text-pink/80">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;