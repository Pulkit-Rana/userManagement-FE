// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/ui/components/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16 flex flex-col items-center justify-center gap-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          Welcome to <span className="text-primary">V-Nest</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          The secure, production-ready dashboard starter kit built with <strong>Spring Boot</strong> + <strong>Next.js 15</strong>.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/auth/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg">Sign Up</Button>
          </Link>
        </div>
      </section>

      {/* Hero Illustration */}
      <section className="max-w-4xl">
        <Image
          src="https://undraw.io/assets/illustrations/undraw_secure_login_pdn4.svg"
          alt="Secure Login Illustration"
          width={800}
          height={400}
          className="w-full h-auto"
        />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl text-center">
        {[
          {
            title: 'Enterprise Auth',
            desc: 'Robust JWT + HttpOnly cookie auth across client and backend.',
            icon: 'https://undraw.io/assets/illustrations/undraw_authentication_re_svpt.svg',
          },
          {
            title: 'AI Agent Ready',
            desc: 'Plug in LangGraph + Qdrant + Reasoning flow from day one.',
            icon: 'https://undraw.io/assets/illustrations/undraw_artificial_intelligence_re_enpp.svg',
          },
          {
            title: 'DevOps Native',
            desc: 'Integrated with ADO, story tracking, bug creation and web search.',
            icon: 'https://undraw.io/assets/illustrations/undraw_dev_productivity_re_fylf.svg',
          },
        ].map((f, i) => (
          <div key={i} className="p-6 bg-muted rounded-xl shadow-sm hover:shadow-md transition">
            <Image
              src={f.icon}
              alt={f.title}
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <footer className="text-center pt-16 text-sm text-muted-foreground">
        Built by Master Red • Open-source • MIT License
      </footer>
    </main>
  );
}
