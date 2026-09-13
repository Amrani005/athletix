'use client'
import { useLanguage } from '@/app/context/LanguageContext';

export default function BrandEthos() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
          {t('engineeredUnseen')}
        </h2>
        <p className="text-lg md:text-xl text-gray-500 font-medium">
          {t('brandDescription')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full border-t border-gray-200 pt-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-black mb-2">01</span>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">{t('premiumMaterials')}</h4>
            <p className="text-sm text-gray-500">{t('premiumMaterialsDescription')}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-black mb-2">02</span>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">{t('globalShipping')}</h4>
            <p className="text-sm text-gray-500">{t('globalShippingDescription')}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-black mb-2">03</span>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">{t('kineticFit')}</h4>
            <p className="text-sm text-gray-500">{t('kineticFitDescription')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}