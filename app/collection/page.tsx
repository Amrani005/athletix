'use server'
import React from 'react'
import CollectionClient from '@/components/CollectionClient'
import Header from '@/components/Header'
import { db } from '@/lib/db';

const page = async () => {
  const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  return (
    <div className='flex flex-col' >
      <Header/>
      <CollectionClient products={products} />
       
      
    </div>
  )
}

export default page
