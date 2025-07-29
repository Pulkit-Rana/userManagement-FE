'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/ui/components/form';
import { Input } from '@/app/ui/components/input';
import { Button } from '@/app/ui/components/button';

const formSchema = z
  .object({
    firstName: z.string().min(2, 'First name required'),
    lastName: z.string().min(2, 'Last name required'),
    username: z.string().email('Valid email required'),
    password: z
      .string()
      .min(8, 'Min 8 chars')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Must include uppercase, lowercase, digit',
      }),
    passwordConfirmation: z.string(),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: "Passwords don't match",
  });

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      toast.success(data.message || 'Registered! Check email for OTP');
      router.push('/auth/verify');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-zinc-900 to-background text-foreground flex items-center justify-center relative px-4 py-10">
      <Toaster richColors position="top-right" />
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-10 bg-background/90 shadow-xl rounded-2xl p-8 backdrop-blur-lg border border-border">
        {/* Left: Illustration */}
        <div className="hidden md:block">
          <img
            src="https://undraw.co/api/illustrations/undraw_secure_login_pdn4.svg"
            alt="Secure Login"
            className="w-full h-auto"
          />
        </div>

        {/* Right: Signup Form */}
        <div className="w-full">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-muted-foreground text-sm">
              Start your secure journey into V-Nest
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
