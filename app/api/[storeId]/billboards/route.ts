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

    const { label, imageUrl } = body;

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No name input is received
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    // No imageUrl input is received
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST] ", error);
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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
