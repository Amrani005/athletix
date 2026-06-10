import { db } from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import DashboardChart from "@/components/DashboardChart";
import SideBarNav from "@/components/SideBarNav";
import { 
  ShoppingBag, 
  Package, 
  Plus,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
  ArchiveRestore
} from "lucide-react";
import { format } from "date-fns";

export default async function DashboardPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetching all data
  const [ordersCount, draftsCount, productsCount, recentOrderDates, recentOrders] = await Promise.all([
    db.order.count({ where: { status: { not: 'draft' } } }),
    db.order.count({ where: { status: 'draft' } }),
    db.product.count(),
    db.order.findMany({
      where: { status: { not: 'draft' }, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true } 
    }),
    db.order.findMany({
      where: { status: { not: 'draft' } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  ]);

  return (
    <section className="min-h-screen bg-[#F8FAFC] pb-12" dir="rtl">
      
      {/* Sidebar Navigation */}
      <SideBarNav />

      {/* Main Dashboard Area */}
      <main className="flex-1 max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-200 pb-8 mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase text-black mb-2">
              Executive Overview
            </h1>
            <p className="text-neutral-500 text-sm tracking-wide">
              Real-time performance metrics and archive analytics.
            </p>
          </div>
          <Link 
            href="/dashboard/products/add" 
            className="flex items-center gap-3 bg-black text-white px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add to Archive
          </Link>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Orders KPI */}
          <Link href="/dashboard/orders" className="group flex flex-col justify-between border border-neutral-200 p-8 hover:border-black transition-colors duration-300">
            <div className="flex justify-between items-start mb-12">
              <div className="p-3 bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold tracking-widest uppercase text-neutral-400 group-hover:text-black transition-colors">
                <TrendingUp className="w-3 h-3 mr-2" /> +12%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-2">Total Orders</p>
              <div className="flex items-end justify-between">
                <h3 className="text-5xl font-light tracking-tighter text-black">{ordersCount}</h3>
                <ArrowUpRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
              </div>
            </div>
          </Link>

          {/* Drafts KPI */}
          <Link href="/dashboard/draft" className="group flex flex-col justify-between border border-neutral-200 p-8 hover:border-black transition-colors duration-300">
            <div className="flex justify-between items-start mb-12">
              <div className="p-3 bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors">
                <ArchiveRestore className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-2">Abandoned Drafts</p>
              <div className="flex items-end justify-between">
                <h3 className="text-5xl font-light tracking-tighter text-black">{draftsCount}</h3>
                <ArrowUpRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
              </div>
            </div>
          </Link>

          {/* Products KPI */}
          <Link href="/dashboard/products" className="group flex flex-col justify-between border border-neutral-200 p-8 hover:border-black transition-colors duration-300">
            <div className="flex justify-between items-start mb-12">
              <div className="p-3 bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-colors">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-2">Active Inventory</p>
              <div className="flex items-end justify-between">
                <h3 className="text-5xl font-light tracking-tighter text-black">{productsCount}</h3>
                <ArrowUpRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
              </div>
            </div>
          </Link>

        </div>

        {/* Chart & Directives Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Chart Area */}
          <div className="lg:col-span-2 border border-neutral-200 p-8">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-bold tracking-[0.2em] text-black uppercase">Revenue Flow</h3>
             </div>
             {/* Assuming DashboardChart is responsive. You may need to tweak its internal colors to match the B&W theme */}
            <DashboardChart orders={recentOrderDates} />
          </div>

          {/* System Directive Area */}
          <div className="border border-neutral-200 p-8 flex flex-col">
            <h3 className="text-sm font-bold tracking-[0.2em] text-black uppercase mb-8">System Directives</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-neutral-50 border border-neutral-200 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-2 w-2 rounded-full bg-black animate-pulse"></span>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-black">Recovery Campaign</h4>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">
                  There are {draftsCount} pending drafts. Initiating a recovery sequence could optimize conversion rates for this quarter.
                </p>
                <Link 
                  href="/dashboard/draft" 
                  className="mt-4 w-full text-center bg-transparent border border-black text-black hover:bg-black hover:text-white px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Initiate Protocol
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div>
          <div className="flex justify-between items-end border-b border-neutral-200 pb-4 mb-6">
            <h3 className="text-2xl font-medium tracking-tight text-black uppercase">Recent Transactions</h3>
            <Link href="/dashboard/orders" className="text-xs font-bold tracking-[0.1em] text-neutral-500 hover:text-black uppercase underline underline-offset-4 transition-colors">
              View Ledger
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  <th className="py-4 pr-6 font-medium">Order ID</th>
                  <th className="py-4 px-6 font-medium">Timestamp</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 pl-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm font-light text-neutral-400">
                      No recent transactions found in the archive.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors group">
                      <td className="py-6 pr-6 text-sm font-medium tracking-widest text-black">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-6 px-6 text-sm font-light text-neutral-500 tracking-wide">
                        {format(new Date(order.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="py-6 px-6">
                        <span className="inline-flex items-center px-3 py-1 border border-black text-[10px] font-bold tracking-widest uppercase text-black bg-transparent">
                          Fulfilled
                        </span>
                      </td>
                      <td className="py-6 pl-6 text-right">
                        <Link 
                          href={`/dashboard/orders/${order.id}`} 
                          className="inline-flex text-neutral-300 hover:text-black transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </section>
  );
}