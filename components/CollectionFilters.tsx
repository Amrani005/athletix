'use client';

import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '@/app/context/LanguageContext';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
};

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest';

type CollectionFiltersProps = {
  products: Product[];
  onFilteredProductsChange: (products: Product[]) => void;
  onClearFilters: () => void;
};

export default function CollectionFilters({
  products,
  onFilteredProductsChange,
  onClearFilters,
}: CollectionFiltersProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filteredProducts = products.filter((product) => {
      if (!normalizedSearch) return true;

      return [product.name, product.description ?? ''].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      );
    });

    const sortedProducts = [...filteredProducts].sort((firstProduct, secondProduct) => {
      if (sort === 'price-low') return firstProduct.price - secondProduct.price;
      if (sort === 'price-high') return secondProduct.price - firstProduct.price;
      return 0;
    });

    onFilteredProductsChange(sortedProducts);
  }, [products, search, sort, onFilteredProductsChange]);

  const sortLabels: Record<SortOption, string> = {
    relevance: t('relevance'),
    'price-low': t('priceLow'),
    'price-high': t('priceHigh'),
    newest: t('newest'),
  };

  const clearFilters = () => {
    setSearch('');
    setSort('relevance');
    onClearFilters();
  };

  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="relative w-full md:w-72">
        <input
          type="search"
          placeholder={t('searchCollection')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full bg-transparent border-b border-neutral-300 py-2 pl-2 pr-8 focus:outline-none focus:border-black text-sm tracking-wide transition-colors"
          aria-label={t('searchCollection')}
        />
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {search && (
        <button
          type="button"
          onClick={clearFilters}
          className="hidden md:block text-xs uppercase tracking-wide text-neutral-400 hover:text-black"
        >
          {t('clear')}
        </button>
      )}

      <div className="relative hidden md:block">
        <button
          type="button"
          onClick={() => setIsSortOpen((isOpen) => !isOpen)}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.1em] uppercase text-neutral-500 hover:text-black transition-colors whitespace-nowrap"
          aria-expanded={isSortOpen}
          aria-haspopup="menu"
        >
          {t('sort')}: {sortLabels[sort]}
          <FaChevronDown className="w-3 h-3" />
        </button>

        {isSortOpen && (
          <div className="absolute right-0 top-8 z-20 min-w-48 bg-white border border-neutral-200 shadow-lg" role="menu">
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSort(option);
                  setIsSortOpen(false);
                }}
                className="block w-full px-4 py-3 text-left text-xs uppercase tracking-wide hover:bg-neutral-50"
                role="menuitem"
              >
                {sortLabels[option]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}