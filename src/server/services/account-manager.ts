import { db } from "~/server/db";
import type { Account } from "@prisma/client";

export class AccountManager {
  static async linkAccount(userId: string, provider: string, account: Partial<Account>): Promise<void> {
    // Check if this provider is already linked to another user
    const existingAccount = await db.account.findFirst({
      where: {
        provider,
        providerAccountId: account.providerAccountId!,
        userId: { not: userId }
      }
    });

    if (existingAccount) {
      throw new Error("This account is already linked to another user");
    }

    // Create or update the account
    await db.account.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: account.providerAccountId!
        }
      },
      update: {
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
        refresh_token_expires_in: account.refresh_token_expires_in
      },
      create: {
        userId,
        type: account.type!,
        provider,
        providerAccountId: account.providerAccountId!,
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
        refresh_token_expires_in: account.refresh_token_expires_in
      }
    });
  }

  static async unlinkAccount(userId: string, accountId: string): Promise<void> {
    // Check if this is the user's last authentication method
    const userAccounts = await db.account.findMany({
      where: { userId }
    });

    if (userAccounts.length <= 1) {
      throw new Error("Cannot remove the last authentication method");
    }

    // Delete the account
    await db.account.delete({
      where: {
        id: accountId,
        userId // Ensure user owns this account
      }
    });
  }

  static async getLinkedAccounts(userId: string): Promise<Account[]> {
    return db.account.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
        type: true,
        expires_at: true,
        // Don't expose sensitive tokens
        access_token: false,
        refresh_token: false,
        id_token: false
      }
    }) as Promise<Account[]>;
  }

  static async refreshTokens(accountId: string): Promise<boolean> {
    const account = await db.account.findUnique({
      where: { id: accountId }
    });

    if (!account?.refresh_token) {
      return false;
    }

    try {
      // Provider-specific token refresh logic would go here
      // For now, just mark as needing re-authentication
      await db.account.update({
        where: { id: accountId },
        data: {
          // Clear expired tokens to force re-auth
          access_token: null,
          expires_at: null
        }
      });
      
      return false; // Indicates re-auth needed
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }
}