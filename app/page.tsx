import React from 'react'
import Header from '@/components/Header'
import Daker from '@/components/Daker'
import Products from '@/components/Products'
import Footer from '@/components/Footer'
import BrandEthos from '@/components/BrandEthos'



const page = () => {
  return (
    <div  className='flex flex-col'>
      <Header/>
      <Daker/>
      <BrandEthos/>
      <Products/>
      <Footer/>   
    </div>
  )
  
}

export default page


