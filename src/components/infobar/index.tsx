import React from 'react'
import { Headphones } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const InfoBar = () => {
  return (
    <div
    className='flex w-full justify-between items-center py-1 mb-8'>
        <div>
          <h2 className="text-2xl font-bold">conversation</h2>
          <p className="text-muted-foreground mt-1">
            Suivez vos discussions et répondez en temps réel à vos utilisateurs.
          </p>
        </div>
        <div className="flex gap-3 items-center ">
            <Avatar>
                <AvatarImage
                src="https://github.com/shadcn.png"
                alt='@shadcn'
                className='w-40'/>
                <AvatarFallback>SE</AvatarFallback>
            </Avatar>

        </div>
    </div>
  )
}

export default InfoBar
