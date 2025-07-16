"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin since we only use Google OAuth
    router.replace("/auth/signin");
  }, [router]);

  return (
    <div className="min-h-screen bg-cosmic-gray/50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-stone-gray border-t-accent-blue rounded-full animate-spin" />
    </div>
  );
}