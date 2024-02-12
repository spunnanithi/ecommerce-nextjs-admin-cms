import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { colorId: string } },
) {
  try {
    // No params that contain the colorId
    if (!params.colorId) {
      return new NextResponse("Color ID required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_GET] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
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

    // No params that contain the colorId
    if (!params.colorId) {
      return new NextResponse("Color ID required", { status: 400 });
    }

    // Check if user has authorization to modify size
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_PATCH] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
    const { userId } = auth();

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No params that contain the colorId
    if (!params.colorId) {
      return new NextResponse("Color ID required", { status: 400 });
    }

    // Check if user has authorization to modify size
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_DELETE] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
