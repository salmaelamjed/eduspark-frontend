import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import {  ArrowLeftRight } from 'lucide-react'
type Props={
    trigger : React.ReactNode
    children : React.ReactNode
    title : string 
    description : string 
    type ?: 'Integration'
    logo?:string 

}
const Modal = ({trigger,children,title,description,type}:Props) => {
   switch (type){
    case 'Integration':
        return(
            <Dialog>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>
               <div className="flex items-center justify-center gap-6">
                    <div className="w-40 h-12 relative flex items-center mb-5">
                        <Image
                        src="/images/EdusparkL.svg"
                        fill
                        alt="EduSpark logo"
                        className="object-contain"
                        />
                    </div>

                    <div className="  text-gray-400 ">
                        <ArrowLeftRight/>
                    </div>
                    <div className="w-40 h-12 relative flex items-center">
                        <Image
                        src="/images/stripe.png"
                        alt="Stripe logo"
                        width={70}
                        height={20}
                        className=""
                        />
                    </div>
</div>


                    <DialogHeader className='flex items-center'>
                        <DialogTitle className='text-xl'>{title}</DialogTitle>
                        <DialogDescription className='text-center'>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        )
        default:
            return(
                <Dialog>
                    <DialogTrigger asChild >{trigger}</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-xl'>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>
                        {children}
                    </DialogContent>
                </Dialog>
            )
   }
}

export default Modal
