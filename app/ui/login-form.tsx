'use client';

import { ArrowRight, Key } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/app/lib/validations/loginSchema';
import { z } from 'zod';
import { useLogin } from '@/app/lib/hooks/useLogin';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/components/button';
import { toast } from 'sonner';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, loading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data.username, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-4">
      <div className="rounded-2xl bg-white shadow-md p-8">
        <h1 className={`${lusitana.className} mb-6 text-3xl text-center text-gray-900`}>
          Sign in to your account
        </h1>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              id="username"
              {...register('username')}
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 px-10 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <ArrowRight className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <input
              type="password"
              id="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-10 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full justify-center text-white" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>

        {/* Optional: Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Don’t have an account?{' '}
          <a href="/auth/register" className="text-indigo-600 hover:underline">Register</a>
        </p>
      </div>
    </form>
  );
}
