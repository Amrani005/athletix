import React from 'react'
import { UserCircleIcon } from '@heroicons/react/16/solid'

const UserIcon = () => {
  return (
    <div className='flex'>
      <UserCircleIcon className="w-8 h-10 text-zinc-400 scale-[1.5]
       cursor-pointer lg:-translate-x-80 "/>
    </div>
  )
}

export default UserIcon
