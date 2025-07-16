"use client";

import { AuthProvider } from "~/contexts/auth-context";
import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TRPCReactProvider>
        {children}
      </TRPCReactProvider>
    </AuthProvider>
  );
}