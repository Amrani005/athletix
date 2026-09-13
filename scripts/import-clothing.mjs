import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_CATEGORY = 'mens-shirts';
const DEFAULT_LIMIT = 10;
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function getProductCategory(apiCategory) {
  if (apiCategory.startsWith('mens-')) return 'Men';
  if (apiCategory.startsWith('womens-')) return 'Women';
  if (apiCategory.startsWith('kids-')) return 'Kids';
  return 'Unisex';
}

function getArgument(name, fallback) {
  const argument = process.argv.find((value) => value.startsWith(`--${name}=`));
  return argument ? argument.slice(name.length + 3) : fallback;
}

const category = getArgument('category', DEFAULT_CATEGORY);
const limit = Number(getArgument('limit', DEFAULT_LIMIT));
const dryRun = process.argv.includes('--dry-run');

if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
  throw new Error('The limit must be an integer between 1 and 100.');
}

async function importClothing() {
  const response = await fetch(
    `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`DummyJSON request failed with status ${response.status}.`);
  }

  const payload = await response.json();
  const products = Array.isArray(payload.products) ? payload.products : [];

  if (products.length === 0) {
    console.log(`No products found for category: ${category}`);
    return;
  }

  let imported = 0;
  let skipped = 0;

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.title },
      select: { id: true },
    });

    if (existingProduct) {
      skipped += 1;
      console.log(`Skipped existing product: ${product.title}`);
      continue;
    }

    const productData = {
      name: product.title,
      category: getProductCategory(category),
      price: Number(product.price),
      description: product.description || null,
      imageUrl: product.thumbnail || product.images?.[0] || '',
      images: JSON.stringify(Array.isArray(product.images) ? product.images : []),
      size: JSON.stringify(DEFAULT_SIZES),
    };

    if (dryRun) {
      console.log(`[dry-run] ${productData.name}`);
    } else {
      await prisma.product.create({ data: productData });
      console.log(`Imported: ${productData.name}`);
    }

    imported += 1;
  }

  console.log(`${dryRun ? 'Would import' : 'Imported'} ${imported} product(s); skipped ${skipped}.`);
}

importClothing()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
