import React from 'react'
import Header from '@/components/Header'
import Daker from '@/components/Daker'
import Products from '@/components/Products'
import Footer from '@/components/Footer'



const page = () => {
  return (
    <div  className='flex flex-col'>
      <Header/>
      <Daker/>
      <Products/>
      <Footer/>   
    </div>
  )
  
}

export default page


