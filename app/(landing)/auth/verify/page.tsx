'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/app/ui/components/card';
import { Button } from '@/app/ui/components/button';
import { Input } from '@/app/ui/components/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/app/ui/components/form';
import { Toaster, toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Enter a valid email'),
  otp: z.string().min(4, 'Enter a valid OTP').max(6),
});

type FormData = z.infer<typeof formSchema>;

export default function OtpVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // ✅ Include cookie (refreshToken)
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'OTP verification failed');
      }

      // ✅ Optional: store accessToken in memory / context (avoid localStorage for security)
      // loginContext.login(json.accessToken);

      toast.success('OTP verified! Redirecting...');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center px-4">
      <Toaster richColors position="top-right" />
      <Card className="w-full max-w-md shadow-xl border-none rounded-2xl bg-white/10 backdrop-blur-sm text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-white/80">
            Enter the OTP sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit code" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
