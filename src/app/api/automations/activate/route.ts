import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { activateRecipe, ActivationError } from "@/lib/recipe-engine";
import { log } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orgId = (session as any).organizationId;
  if (!orgId) {
    return NextResponse.json({ error: "no_organization" }, { status: 400 });
  }

  const { recipeId, config } = await req.json();

  try {
    const result = await activateRecipe(orgId, recipeId, config);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ActivationError) {
      return NextResponse.json(
        { error: e.code, message: e.message, ...e.details },
        { status: e.statusCode }
      );
    }
    log.error("Activation failed:", e);
    return NextResponse.json({ error: "activation_failed" }, { status: 500 });
  }
}
