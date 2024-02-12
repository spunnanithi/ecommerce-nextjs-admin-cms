import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    // No params that contain the billboardId
    if (!params.categoryId) {
      return new NextResponse("Category ID required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { name, billboardId } = body;

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No name input is received
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // No billboard ID input is received
    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    // No params that contain the billboardId
    if (!params.categoryId) {
      return new NextResponse("Category ID required", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No params that contain the categoryId
    if (!params.categoryId) {
      return new NextResponse("Category ID required", { status: 400 });
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
