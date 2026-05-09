export type ProductTypeKey =
  | "BOUQUET"
  | "CROCHET"
  | "GAJRA"
  | "CUSTOM"
  | "SEASONAL"
  | "PREMIUM";

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  imageId: string;
  imageIds?: string[];
  type: ProductTypeKey;
  rating: number;
  reviewCount: number;
  stock: number;
  categoryId: string;
  categorySlug?: string;
  featured?: boolean;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageId?: string | null;
}

export interface FlowerSummary {
  id: string;
  name: string;
  slug: string;
  imageId: string;
  basePrice: number;
  colors: string[];
}

export interface GiftCardTemplateSummary {
  id: string;
  name: string;
  description?: string | null;
  imageId: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId?: string;
  variantId?: string;
  customBouquetId?: string;
  name: string;
  imageId: string;
  price: number;
  quantity: number;
  meta?: Record<string, string | number>;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
}
