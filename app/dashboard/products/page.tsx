import { db } from "@/lib/db";
import ProductsList from "@/components/ProductsList"; // Import the client component
import SideBarNav from "@/components/SideBarNav";
export default async function ProductsPage() {
  // 1. Fetch data on the server
  const products = await db.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
   
      <div className="relative z-10">
        <SideBarNav/>
        <ProductsList products={products} />
      </div>
      
  
  );
}