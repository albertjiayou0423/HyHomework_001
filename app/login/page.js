"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center pt-12 p-4">
      <Link href="/">
        <Github className="w-12 h-12 text-white mb-8" />
      </Link>
      <Card className="w-full max-w-sm bg-[#161b22] border-[#30363d] text-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-normal">Sign in to GitClass</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm">Username or email address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0d1117] border-[#30363d] focus-visible:ring-[#1f6feb]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm">Password</label>
                <Link href="#" className="text-xs text-[#58a6ff]">Forgot password?</Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0d1117] border-[#30363d] focus-visible:ring-[#1f6feb]"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <Button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043] text-white">
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center w-full border border-[#30363d] rounded-md py-3 mt-2">
            New to GitClass? <Link href="#" className="text-[#58a6ff]">Create an account</Link>.
          </div>
          <div className="text-xs text-[#7d8590] flex gap-4 justify-center">
            <span>Test: teacher@test.com / teacher123</span>
          </div>
          <div className="text-xs text-[#7d8590] flex gap-4 justify-center">
            <span>Test: student@test.com / student123</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
