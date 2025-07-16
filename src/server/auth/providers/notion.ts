import { env } from "~/env";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

interface NotionProfile {
  object: "user";
  id: string;
  name: string;
  avatar_url: string | null;
  type: "person";
  person: {
    email: string;
  };
}

export function NotionProvider<P extends NotionProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "notion",
    name: "Notion",
    type: "oauth",
    authorization: {
      url: "https://api.notion.com/v1/oauth/authorize",
      params: {
        owner: "user",
        response_type: "code"
      }
    },
    token: "https://api.notion.com/v1/oauth/token",
    userinfo: {
      url: "https://api.notion.com/v1/users/me",
      async request({ tokens }) {
        const response = await fetch("https://api.notion.com/v1/users/me", {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "Notion-Version": "2022-06-28"
          }
        });
        return await response.json();
      }
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.person?.email,
        image: profile.avatar_url
      };
    },
    style: {
      logo: "/notion-logo.svg",
      logoDark: "/notion-logo.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff"
    },
    options
  };
}

export const notionProvider = NotionProvider({
  clientId: env.AUTH_NOTION_ID!,
  clientSecret: env.AUTH_NOTION_SECRET!
});