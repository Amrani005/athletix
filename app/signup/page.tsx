import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SignUp from '@/components/SignUp'

const page = () => {
  return (
   <div className='flex flex-col gap-50 h-196'>
    <Header/>
    <SignUp/>
    <Footer/>
   </div>
  )
}

export default page
