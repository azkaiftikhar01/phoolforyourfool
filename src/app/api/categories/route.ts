import { NextResponse } from "next/server";
import { getCategories } from "@/lib/data/products";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}
