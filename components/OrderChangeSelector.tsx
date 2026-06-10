"use client";

import React, { useState } from 'react';

export default function OrderChangeSelecter({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus || "pending");
  
  // Professional soft colors for the badges
  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200",
    pending: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    canceled: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200",
    retour: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    // Note: Add your server action here to update the DB when you are ready!
  }

  return (
    <div className="relative inline-block w-full min-w-[120px]">
      <select 
        value={status}
        onChange={handleStatus}
        className={`w-full appearance-none px-3 py-1.5 text-xs font-bold rounded-full border cursor-pointer outline-none transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/30 text-center ${statusColors[status] || statusColors.pending}`}
      >
        <option value="draft">مسودة</option>
        <option value="pending">قيد الانتظار</option>
        <option value="confirmed">مؤكد</option>
        <option value="shipped">تم الشحن</option>
        <option value="delivered">تم التوصيل</option>
        <option value="canceled">ملغي</option>
        <option value="retour">مرجع</option>
      </select>
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center px-1">
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}