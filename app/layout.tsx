import { Geist, Geist_Mono} from "next/font/google";
import { CartCountProvider } from "./context/CartCountContext";
import { Fira_Code } from "next/font/google";
import Header from "@/components/Header";
import React from "react";
import { ProductProvider } from "./context/ProductContext";
import "@/app/globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const firaCode = Fira_Code({
  variable: "--font-geist-code",
  subsets: ["latin"],
});




export default function RootLayout({
  children,
}: 
{  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${firaCode.variable} antialiased`}
      >
         <CartCountProvider>
          <ProductProvider>
            {children}
          </ProductProvider>
          
        </CartCountProvider>
      </body>
    </html>
  );
}
export const navigation = [
  {
    id: "0",
    title: "Home",
    url: "/home",
  },
  {
    id: "1",
    title: "About ",
    url: "/about",
    
  },
  {
    id: "2",
    title: "Collection",
    url: "/collection",
  },
  {
    id: "3",
    title: "Contact",
    url: "/contact",
  },
];

export const options = [
  {
    id: "0",
    title: "Quality Assurance:",
    desc:"We meticulously select and vet each product to ensure it meets our stringent quality standards."
  },
  {
    id: "1",
    title: "Convenience:",
    desc:'With our user-friendly interface and hassle-free ordering process, shopping has never been easier.',
    
  },
  {
    id: "2",
    title: "Exceptional Customer Service:",
    desc:'Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.',
  },
  
 
];
export const category = [
  {
    id:"0",
    title:"Men",
  },
  {
    id:"1",
    title:"Women",
  },
  {
    id:"2",
    title:"KIds",
  },
];
export const types = [
  {
    id:"0",
    title:"TopWear",
  },
  {
    id:"1",
    title:"BottomWear",
  },
  
]
export const buttons = [
  {    id:"0",
    letter:"s",
  },
  {    id:"0",
    letter:"m",
  },
  {    id:"0",
    letter:"l",
  },
  {    id:"0",
    letter:"xl",
  },
  {    id:"0",
    letter:"xxl",
  },
]
export const cards = [
  {
    id: "0",
    title: "Product 1",
    description: "This is the description for product 1",
    price:"12.99",
    img:"/p_img3.png",
    link: "/products/0",
    letter:"s",

  },
  {
    id: "1",
    title: "Product 2",
    description: "This is the description for product 2",
    price:"16.46",
    img:"/p_img2_1.png",
    link: "/products/1",
    letter:"m",

  },
  {
    id: "2",
    title: "Product 3",
    description: "This is the description for product 3",
    price:"32.90",
    img:"/p_img7.png",
    link: "/products/2",
    letter:"l",

  },
  {
    id: "3",
    title: "Product 4",
    description: "This is the description for product 4",
    price:"23.90",
    img:"/p_img8.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "4",
    title: "Product 4",
    description: "This is the description for product 5",
    price:"45.50",
    img:"/p_img8.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "5",
    title: "Product 4",
    description: "This is the description for product 6",
    price:"14.90",
    img:"/p_img7.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "6",
    title: "Product 4",
    description: "This is the description for product 7",
    price:"43.90",
    img:"/p_img3.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "7",
    title: "Product 4",
    description: "This is the description for product 8",
    price:"12.35",
    img:"/p_img2_1.png",
    link: "/products/3",
    letter:"xxl"
  },
  {
    id: "8",
    title: "Product 9",
    description: "This is the description for product 9",
    price:"12.35",
    img:"/doka.png",
    link: "/products/3",
    letter:"xxl"
  },
  
]