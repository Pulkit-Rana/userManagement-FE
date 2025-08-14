"use client"

import Link from "next/link"
import { Button } from "@/app/ui/components/button"
import { useScrollReveal } from "@/app/lib/hooks/useScrollReveal"

export default function HomePage() {
  const hero = useScrollReveal<HTMLDivElement>()
  const features = useScrollReveal<HTMLDivElement>()
  const mobile = useScrollReveal<HTMLDivElement>()
  const integrations = useScrollReveal<HTMLDivElement>()
  const security = useScrollReveal<HTMLDivElement>()
  const pricing = useScrollReveal<HTMLDivElement>()
  const cta = useScrollReveal<HTMLDivElement>()

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-border bg-background/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 font-extrabold tracking-tight">
            <span
              className="h-8 w-8 rounded-lg"
              style={{ background: "conic-gradient(from 180deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))" }}
              aria-hidden
            />
            <span>SyncNest</span>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <a className="opacity-80 hover:opacity-100" href="#features">Features</a>
            <a className="opacity-80 hover:opacity-100" href="#mobile">Mobile</a>
            <a className="opacity-80 hover:opacity-100" href="#integrations">Integrations</a>
            <a className="opacity-80 hover:opacity-100" href="#security">Security</a>
            <a className="opacity-80 hover:opacity-100" href="#pricing">Pricing</a>
          </nav>
          <Link href="#cta">
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              Get SyncNest
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO — gradient bg + card mosaic */}
      <section
        ref={hero.ref}
        className={`relative flex flex-col justify-center px-6 py-20 overflow-hidden transition-all duration-700 ${
          hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-border text-xs font-semibold bg-primary/10 text-primary">
              ✨ New • Private by design
            </span>
            <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-primary">
              Your AI Personal Manager — <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SyncNest</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Plan your schedule, track diet & habits, get smart reminders, manage finances, and receive proactive advice — in one calm dashboard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link href="/auth/login">
                <Button size="lg" className="px-7 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  Get Started
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg" className="px-7">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Card mosaic (token colors only) */}
          <div className="relative h-[520px] lg:h-[560px]">
            {/* Schedule */}
            <div className="absolute left-2 top-2 w-[320px] max-w-[85%] rounded-2xl border border-border bg-card/90 backdrop-blur p-4 shadow-xl animate-[float_10s_ease-in-out_infinite]">
              <div className="flex items-center justify-between font-bold">Today <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted/20">Auto-plan</span></div>
              <div className="mt-3 space-y-2">
                {[
                  ["09:00", "Focus — Strategy doc", "45m"],
                  ["12:30", "Lunch · 640 kcal · 45g protein", "Diet"],
                  ["18:00", "Gym — Push Day", "Health"],
                ].map(([time, label, chip], i) => (
                  <div key={i} className="flex items-center justify-between text-sm rounded-xl border border-border bg-muted/10 px-3 py-2">
                    <span className="font-semibold">{time}</span>
                    <span className="opacity-90">{label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted/20">{chip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diet */}
            <div className="absolute left-0 top-44 w-[260px] rounded-2xl border border-border bg-card/90 backdrop-blur p-4 shadow-xl animate-[float_10s_ease-in-out_infinite] [animation-delay:.6s]">
              <div className="flex items-center justify-between font-bold">Diet tracker <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted/20">Coach</span></div>
              <div className="mt-2 text-sm">Target <strong>2,200</strong> kcal</div>
              <div className="mt-2 h-2 rounded-full bg-muted/20 overflow-hidden">
                <div className="h-full w-[72%] bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">1,580 / 2,200 · Add 20g protein</div>
            </div>

            {/* Reminders */}
            <div className="absolute left-10 bottom-4 w-[260px] rounded-2xl border border-border bg-card/90 backdrop-blur p-4 shadow-xl animate-[float_10s_ease-in-out_infinite] [animation-delay:1.2s]">
              <div className="flex items-center justify-between font-bold">Reminders <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted/20">Smart</span></div>
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Pay electricity bill — Fri</li>
                <li>Reply to recruiter — today</li>
                <li>Drink water — every 2h</li>
              </ul>
            </div>

            {/* Finance */}
            <div className="absolute right-2 top-4 w-[320px] max-w-[85%] rounded-2xl border border-border bg-card/90 backdrop-blur p-4 shadow-xl animate-[float_10s_ease-in-out_infinite] [animation-delay:.3s]">
              <div className="flex items-center justify-between font-bold">Finances <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted/20">Secure</span></div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <strong className="text-base">$3,104</strong>
                <span className="text-muted-foreground">saved this month</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted/20 overflow-hidden">
                <div className="h-full w-[48%] bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Alert: subscription price increase detected</div>
            </div>

            {/* Advice */}
            <div className="absolute right-[-6px] top-56 w-[260px] rounded-2xl border border-border bg-card/90 backdrop-blur p-4 shadow-xl animate-[float_10s_ease-in-out_infinite] [animation-delay:.9s]">
              <div className="flex items-center justify-between font-bold">Advice <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted/20">Proactive</span></div>
              <p className="mt-2 text-sm text-muted-foreground">“Shift tomorrow's run to morning — cooler temp and fewer meetings.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        ref={features.ref}
        className={`px-6 py-20 bg-gradient-to-b from-background to-muted/30 transition-all duration-700 ${
          features.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-primary">Why SyncNest?</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Everything you need to feel on top of everything.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["Wellness & Habits", "Daily mood check-ins, water intake, and meditation prompts that adapt to your energy."],
              ["Meal Planning & Grocery Sync", "Weekly meal plans with smart grocery lists that match your macros and budget."],
              ["Smart Event Coordination", "Finds meeting times across time zones and reschedules when conflicts appear."],
              ["Goal Tracking", "Set personal or professional goals and see progress with clear visuals."],
              ["Learning & Skill Building", "Curated reading lists and podcast suggestions based on your interests."],
              ["Home & Chores", "Shared task boards for family or roommates with due-dates and reminders."],
            ].map(([title, desc], i) => (
              <div key={i} className="group rounded-2xl border border-border bg-card p-6 shadow-lg hover:shadow-2xl transition">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE — scroll-snap carousel */}
      <section
        id="mobile"
        ref={mobile.ref}
        className={`px-6 py-20 transition-all duration-700 ${
          mobile.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-primary">Designed for your pocket</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">
            iOS and Android apps deliver the same clarity, with quick-actions and offline mode.
          </p>

          <div className="flex gap-4 overflow-x-auto scroll-snap-x scroll-smooth pb-3 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-muted/40 rounded-xl">
            {[
              { title: "Today", blocks: [["09:00", "Standup"], ["11:00", "Deep work"], ["18:00", "Gym"]] },
              { title: "Diet", blocks: [["Target", "2,200 kcal"], ["Progress", "72%"], ["Tip", "Dinner +20g protein"]] },
              { title: "Finances", blocks: [["Saved", "$3,104"], ["Budget used", "48%"], ["Advice", "Move idle cash"]] },
            ].map((phone, i) => (
              <div
                key={i}
                className="scroll-snap-start shrink-0 w-[280px] h-[560px] relative rounded-[36px] border border-border bg-gradient-to-b from-muted/30 to-background shadow-2xl"
                aria-label={`Phone ${i + 1}`}
              >
                <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-28 rounded-b-xl bg-muted" />
                <div className="absolute inset-4 rounded-3xl border border-border bg-background p-4 grid gap-3">
                  <div className="text-base font-bold">{phone.title}</div>
                  {phone.blocks.map(([k, v], idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-card p-3 text-sm flex items-center justify-between">
                      <span className="opacity-90">{k}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section
        id="integrations"
        ref={integrations.ref}
        className={`px-6 py-20 bg-gradient-to-b from-background to-muted/30 transition-all duration-700 ${
          integrations.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-primary">Works with your stack</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect calendar, notes, health, and banks — no new workflows required.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {["Google Cal", "Outlook", "Notion", "Slack", "Strava", "Fitbit"].map((logo) => (
              <div key={logo} className="rounded-xl border border-border bg-card py-4 text-center font-semibold opacity-90">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY / AI BRAIN / STORIES */}
      <section
        id="security"
        ref={security.ref}
        className={`px-6 py-20 transition-all duration-700 ${
          security.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["Security & Privacy", "End-to-end encryption, data minimization, and granular memory controls."],
            ["AI Brain", "Learns priorities and routines from approvals to automate more over time."],
            ["Success Stories", "“I reclaimed 7 hours a week; SyncNest is my chief of staff.” — Priya"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        ref={pricing.ref}
        className={`px-6 py-20 bg-gradient-to-b from-background to-muted/30 transition-all duration-700 ${
          pricing.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-primary">Start free. Upgrade when ready.</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$0", perks: ["Smart daily plan", "Task capture & triage", "Basic integrations"], cta: "Get started", variant: "secondary" as const },
              { name: "Pro", price: "$12", perks: ["Autonomous delegation", "Diet & finance modules", "Time & spend insights", "Priority support"], cta: "Upgrade", variant: "default" as const, popular: true },
              { name: "Teams", price: "$29", perks: ["Shared projects & SLAs", "Admin & SSO", "Advanced security"], cta: "Contact sales", variant: "secondary" as const },
            ].map((p) => (
              <div key={p.name} className={`relative rounded-2xl border border-border bg-card p-6 shadow-lg ${p.popular ? "ring-2 ring-primary" : ""}`}>
                {p.popular && (
                  <div className="absolute right-4 top-4 text-xs px-2 py-1 rounded-full border border-border bg-primary/10 text-primary font-semibold">
                    Most popular
                  </div>
                )}
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="mt-2 text-3xl font-extrabold">{p.price}<span className="text-sm text-muted-foreground">/mo</span></div>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  {p.perks.map((x) => <li key={x}>• {x}</li>)}
                </ul>
                <div className="mt-6">
                  <Button
                    className={p.variant === "default" ? "w-full bg-gradient-to-r from-primary to-accent text-primary-foreground" : "w-full"}
                    variant={p.variant === "default" ? "default" : "secondary"}
                  >
                    {p.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        ref={cta.ref}
        className={`px-6 py-20 transition-all duration-700 ${
          cta.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-6xl mx-auto rounded-2xl border border-border bg-card p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-primary">Give SyncNest a week. Get your time back.</h2>
            <p className="text-muted-foreground">Try it free — no credit card. Onboard in minutes and feel the difference by Friday.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const btn = (e.currentTarget.querySelector("button") as HTMLButtonElement | null)
              if (btn) btn.textContent = "Check your inbox ↗"
            }}
            className="rounded-xl border border-border bg-background p-4 grid gap-3"
          >
            <label htmlFor="email" className="font-semibold">Join the waitlist</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@domain.com"
              className="h-12 rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring/40"
            />
            <Button type="submit" className="h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground">
              Get early access
            </Button>
            <p className="text-xs text-muted-foreground">We care about privacy. Unsubscribe anytime.</p>
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} SyncNest Labs • Privacy • Terms • Security
      </footer>

      {/* Float keyframes */}
      <style jsx global>{`
        @keyframes float { 50% { transform: translateY(10px); } }
      `}</style>
    </main>
  )
}
