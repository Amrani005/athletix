import React from 'react'
import Cart from '@/components/Cart'
import Footer from '@/components/Footer';
import Header from '@/components/Header'

const page = () => {
  return (
    <div className='flex flex-col gap-"0'>
      <Header/>
      <Cart/>
      <Footer/>
    </div>
  )
}

export default page
