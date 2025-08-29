import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDB();

    const Id = params.id;
    if(!Id) {
        return NextResponse.json(
            { message: `No Id found: ${Id}` },
            { status: 404 }
          );
    }

    const product = await ProductModel.findById(Id);

    if (!product) {
      return NextResponse.json(
        { message: `No product found for Id: ${Id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
