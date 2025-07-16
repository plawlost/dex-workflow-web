import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { AccountManager } from "~/server/services/account-manager";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await AccountManager.getLinkedAccounts(session.user.id);
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Get accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" }, 
        { status: 400 }
      );
    }

    await AccountManager.unlinkAccount(session.user.id, accountId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unlink account error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to unlink account" }, 
      { status: 500 }
    );
  }
}