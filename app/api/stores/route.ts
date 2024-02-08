import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    // Clerk to authenticate POST route
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // No name input is received
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
