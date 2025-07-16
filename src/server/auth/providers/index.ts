import { env } from "~/env";
import { googleProvider } from "./google";
import { slackProvider } from "./slack";
import { notionProvider } from "./notion";

export const providers = [
  // Only include providers if credentials are available
  ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET ? [googleProvider] : []),
  ...(env.AUTH_SLACK_ID && env.AUTH_SLACK_SECRET ? [slackProvider] : []),
  ...(env.AUTH_NOTION_ID && env.AUTH_NOTION_SECRET ? [notionProvider] : []),
];

export { googleProvider, slackProvider, notionProvider };