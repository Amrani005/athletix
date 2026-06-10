
import { db } from '@/lib/db'
import OrdersList from '@/components/OrdersList'
import SideBarNav from "@/components/SideBarNav";



export default async function OrdersPage ()  {

     
     const orders = await db.order.findMany({
      where:{
        NOT:{status: 'draft'}
      },
        orderBy:{
            createdAt: 'desc'
        }
     })
  return(
    <div>
      <SideBarNav/>
      <OrdersList orders={orders} />
    </div>
  );
}

