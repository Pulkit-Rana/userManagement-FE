'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '@/app/lib/hooks/useAuthHooks';

// Schema and types
const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export default function LoginForm() {
  const { login, isLoading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(LoginFormSchema) });

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="username"
          type="email"
          {...register('email')}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white p-2 rounded-md"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}