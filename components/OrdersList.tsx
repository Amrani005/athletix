"use client";

import React from "react";
import Link from "next/link";
import { deleteOrders } from "@/actions/deleteOrders";
import OrderChangeSelecter from "./OrderChangeSelector";
import { 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  Package 
} from "lucide-react";

const OrdersList = ({ orders }: { orders: any[] }) => {
  return (
    <div id="orders" className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-12">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12 pt-10 lg:pt-16">
        
        {/* Editorial Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-200 pb-8 mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase text-black mb-2 flex items-baseline">
              Order Ledger 
              <span className="text-xl font-light text-neutral-400 tracking-normal ml-4">
                [{orders.length}]
              </span>
            </h1>
            <p className="text-neutral-500 text-sm tracking-wide">
              Manage, process, and track customer transactions.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link 
              href="/dashboard"
              className="flex-1 md:flex-none flex justify-center items-center gap-2 border border-black bg-transparent text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Minimalist Ledger Table Container */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              
              {/* Table Header */}
              <thead className="border-b border-black">
                <tr>
                  <th className="py-4 pr-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase w-24">Order ID</th>
                  <th className="py-4 px-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">Customer</th>
                  <th className="py-4 px-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">Location</th>
                  <th className="py-4 px-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">Details</th>
                  <th className="py-4 px-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">Total</th>
                  <th className="py-4 px-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase text-center w-36">Status</th>
                  <th className="py-4 px-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">Date</th>
                  <th className="py-4 pl-6 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase text-right w-20">Action</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="divide-y divide-neutral-100 bg-white">
                {orders.map((order) => {
                  
                  // JSON Parse
                  let details: any = {};
                  try {
                    details = JSON.parse(order.orderItems);
                  } catch (e) {
                    details = { quantity: 1, deliveryType: '?' };
                  }

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors group">
                      
                      {/* Order ID */}
                      <td className="py-6 pr-6 whitespace-nowrap">
                        <span className="font-medium text-sm tracking-widest text-black">
                          #{order.id.slice(0, 6).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-6 px-6 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm tracking-wide text-black flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-neutral-400"/> 
                            {order.customerName}
                          </span>
                          <span className="text-xs font-light tracking-widest text-neutral-500 flex items-center gap-2">
                            <Phone className="w-3 h-3 text-neutral-400"/>
                            {order.customerPhone} 
                          </span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-6 px-6">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          <span className="font-medium text-sm tracking-wide text-black truncate">
                            {details.wilaya}
                          </span>
                          <span className="text-xs font-light text-neutral-500 flex items-start gap-2 truncate" title={order.customerAddress}>
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400"/>
                            <span className="truncate">{order.customerAddress}</span>
                          </span>
                        </div>
                      </td>

                      {/* Details (Quantity & Delivery) */}
                      <td className="py-6 px-6 whitespace-nowrap">
                        <div className="flex flex-col gap-2 items-start">
                          <span className="text-xs font-medium tracking-widest uppercase text-black flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-neutral-400"/> QTY: {details.quantity}
                          </span>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 border border-neutral-200 px-2 py-1">
                            {details.deliveryType === 'Domicile' ? 'Home Delivery' : 'Office Delivery'}
                          </span>
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="py-6 px-6 whitespace-nowrap">
                        <div className="font-light tracking-wider text-black flex items-center gap-1">
                          {Number(order.totalPrice).toLocaleString('en-US')} 
                          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 ml-1">DZD</span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-6 px-6 whitespace-nowrap text-center">
                        <OrderChangeSelecter orderId={order.id} currentStatus={order.status} />
                      </td>

                      {/* Date & Time */}
                      <td className="py-6 px-6 whitespace-nowrap">
                        <div className="text-sm font-light text-black tracking-wide mb-1">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                          {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
                        </div>
                      </td>

                      {/* Actions (Delete) */}
                      <td className="py-6 pl-6 whitespace-nowrap text-right">
                        <form action={deleteOrders}>
                          <input type="hidden" name="id" value={order.id} />
                          <button 
                            type="submit" 
                            className="text-neutral-300 hover:text-red-600 transition-colors inline-flex justify-end"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="py-32 px-6 text-center flex flex-col items-center justify-center border-b border-neutral-200">
                <ShoppingBag className="w-8 h-8 text-neutral-300 mb-6" />
                <h3 className="text-lg font-medium uppercase tracking-tight text-black mb-2">No Transactions</h3>
                <p className="text-sm font-light text-neutral-500 max-w-sm mx-auto tracking-wide leading-relaxed">
                  You have not received any orders yet. New transactions will populate this ledger automatically.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;