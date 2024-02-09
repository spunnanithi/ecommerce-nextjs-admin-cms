import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    // No params that contain the billboardId
    if (!params.billboardId) {
      return new NextResponse("Billboard ID required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
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

    // No image URL input is received
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    // No params that contain the billboardId
    if (!params.billboardId) {
      return new NextResponse("Billboard ID required", { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const { userId } = auth();

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No params that contain the billboardId
    if (!params.billboardId) {
      return new NextResponse("Billboard ID required", { status: 400 });
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
