import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env";

export const googleProvider = GoogleProvider({
  clientId: env.AUTH_GOOGLE_ID!,
  clientSecret: env.AUTH_GOOGLE_SECRET!,
  authorization: {
    params: {
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent"
    }
  }
});