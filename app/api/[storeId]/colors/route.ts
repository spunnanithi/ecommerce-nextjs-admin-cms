import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  },
) {
  try {
    // Clerk to authenticate POST route
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No name input is received
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // No value input is received
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    // No Store ID is received
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Check if user has authorization to modify billboard
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  },
) {
  try {
    // No Store ID is received
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
