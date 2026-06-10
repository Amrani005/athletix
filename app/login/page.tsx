import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Login from '@/components/Login'

const page = () => {
  return (
   <div className='flex flex-col gap-50 h-196'>
    <Header/>
    <Login/>
    <Footer/>
   </div>
  )
}

export default page
