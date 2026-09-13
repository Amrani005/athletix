import { db } from '@/lib/db';
import ProductsClinet from './ProductsClinet';

type ProductCard = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
};

export default async function Products() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const productCards: ProductCard[] = products;

  return <ProductsClinet products={productCards} />;
}