import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET(req: Request, props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  try {
    await connectToDB();

    const kebabCategory = params.category;
    const normalizedInput = kebabCategory.replace(/-/g, ' ').toLowerCase();
    const keywords = normalizedInput.split(/\s+/);

    const regexFilters = keywords.map((word) => ({
      category: { $regex: new RegExp(word, 'i') },
    }));

    const products = await ProductModel.find({ $or: regexFilters }).lean();

    if (products.length === 0) {
      return NextResponse.json(
        { message: `No products found for category: ${kebabCategory}` },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
