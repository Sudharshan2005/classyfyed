import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET() {
    try {
        await connectToDB();

        const products = await ProductModel.find().lean();
        return NextResponse.json(products, { status: 200 });
    } catch(error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}