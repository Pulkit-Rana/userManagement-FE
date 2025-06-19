'use client';

import { Button } from "@/app/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/ui/components/card";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10 relative">
      <Card className="w-full max-w-md shadow-lg border rounded-xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-4xl font-extrabold">SyncNest</CardTitle>
          <CardDescription className="text-muted-foreground">
            The secure dashboard starter kit for Spring Boot + Next.js
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-4">
          <Button size="lg" className="w-full" onClick={() => router.push("/auth/login")}>Login</Button>
          <Button variant="secondary" size="lg" className="w-full" onClick={() => router.push("/register")}>Sign Up</Button>
        </CardContent>
      </Card>
    </main>
  );
}
