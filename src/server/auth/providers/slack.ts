import SlackProvider from "next-auth/providers/slack";
import { env } from "~/env";

export const slackProvider = SlackProvider({
  clientId: env.AUTH_SLACK_ID!,
  clientSecret: env.AUTH_SLACK_SECRET!,
  authorization: {
    params: {
      scope: "identity.basic identity.email identity.avatar"
    }
  }
});