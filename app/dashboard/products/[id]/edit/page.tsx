import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import EditProductForm from "@/components/EditProductForm";

export default async function EditPage({ params }: any) {
  try {
    // 1. Await and resolve params to prevent Next.js dynamic routing errors
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!productId || productId === "[id]") {
      redirect("/dashboard/products");
    }

    // 2. Fetch the specific product from the database
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      redirect("/dashboard/products");
    }

    // 3. Pass the fetched data to the client-side editorial form
    return <EditProductForm product={product} />;

  } catch (error) {
    // High-End Editorial Error State (White Mode)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black p-6 selection:bg-black selection:text-white">
        <div className="border border-neutral-200 bg-neutral-50 p-12 max-w-md w-full flex flex-col items-center text-center">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-500 mb-4">
            System Error
          </span>
          <h1 className="text-2xl font-medium tracking-tight text-black mb-4">
            Failed to load archive data.
          </h1>
          <p className="text-sm font-light text-neutral-500 mb-8 leading-relaxed">
            We encountered an issue retrieving this asset from the database. Please verify your connection or return to the inventory ledger.
          </p>
          <a 
            href="/dashboard/products" 
            className="text-xs font-bold uppercase tracking-[0.1em] text-black underline underline-offset-4 hover:text-neutral-500 transition-colors"
          >
            Return to Inventory
          </a>
        </div>
      </div>
    );
  }
}