import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Product, Image } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    let productData = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 404 });
    }

    if (!productData.name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!productData.price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!productData.categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }
    if (!productData.colorId) {
      return new NextResponse("Color is required", { status: 400 });
    }
    if (!productData.sizeId) {
      return new NextResponse("Size is required", { status: 400 });
    }
    if (!productData.images || !productData.images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product: Product = await prismadb.product.create({
      data: {
        ...productData,
        storeId: params.storeId,
        images: {
          createMany: {
            data: productData.images,
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.trace("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: { images: true, category: true, color: true, size: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.trace("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
