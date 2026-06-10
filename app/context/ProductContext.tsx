'use client'
import React, { use } from 'react'
import {createContext,useContext,useState} from 'react'
import { cards } from '../layout'; 
import { SessionProvider } from 'next-auth/react';

 const ProductContext = 
 createContext<any>(null);

 export const ProductProvider = ({children}:{children:React.ReactNode}) => {
  const [products] = useState([
  {
    id: "0",
    name: "Product 1",
    description: "This is the description for product 1",
    price:"12.99",
    img:"/p_img3.png",
    link: "/products/0",
    letter:"s",

  },
  {
    id: "1",
    name: "Product 2",
    description: "This is the description for product 2",
    price:"16.46",
    img:"/p_img2_1.png",
    link: "/products/1",
    letter:"m",

  },
  {
    id: "2",
    name: "Product 3",
    description: "This is the description for product 3",
    price:"32.90",
    img:"/p_img7.png",
    link: "/products/2",
    letter:"l",

  },
  {
    id: "3",
    name: "Product 4",
    description: "This is the description for product 4",
    price:"23.90",
    img:"/p_img8.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "4",
    name: "Product 4",
    description: "This is the description for product 5",
    price:"45.50",
    img:"/p_img8.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "5",
    name: "Product 4",
    description: "This is the description for product 6",
    price:"14.90",
    img:"/p_img7.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "6",
    name: "Product 4",
    description: "This is the description for product 7",
    price:"43.90",
    img:"/p_img3.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "7",
    name: "Product 4",
    description: "This is the description for product 8",
    price:"12.35",
    img:"/p_img2_1.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "8",
    name: "Product 9",
    description: "This is the description for product 9",
    price:"12.35",
    img:"/doka.png",
    link: "/products/3",
    letter:"xxl"
  },
  
]);
       

  return (
    <SessionProvider>
    <ProductContext.Provider value ={{products}}>
    {children}
    </ProductContext.Provider>
    </SessionProvider>
    
  )
}
 export const useProducts = () =>useContext(ProductContext);
