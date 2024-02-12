import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    // No params that contain the productId
    if (!params.productId) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No name input is received
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // No price input is received
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    // No categoryId input is received
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    // No sizeId input is received
    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    // No colorId input is received
    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    // No images input is received
    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    // No params that contain the productId
    if (!params.productId) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    // Check if user has authorization to modify product
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  // TODO: Do not remove the req even if unused since the params function
  // TODO: must be in the second argument in the API route
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();

    // No user is found
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // No params that contain the productId
    if (!params.productId) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    // Check if user has authorization to modify product
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
