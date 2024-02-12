import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { sizeId: string } },
) {
  try {
    // No params that contain the sizeId
    if (!params.sizeId) {
      return new NextResponse("Size ID required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
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

    // No params that contain the sizeId
    if (!params.sizeId) {
      return new NextResponse("Size ID required", { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No params that contain the sizeId
    if (!params.sizeId) {
      return new NextResponse("Size ID required", { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
