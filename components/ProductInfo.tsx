"use client";

import React, { useState, Suspense, useTransition } from "react";
import ProductDetails from "./ProductDetails";



export default function ProductInfo() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-400">
        Initiating Catalog...
      </div>
    }>
      <ProductDetails />
    </Suspense>
  );
}