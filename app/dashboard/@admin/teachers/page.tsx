import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div>
           <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Gestion des enseignants</h1>
                <p className="text-muted-foreground mt-1">
                  Gérez et suivez vos enseignants 
                </p>
              </div>
                  <Link href={'teachers/create'}
                  className=''
                  >
                  <Button
                    className="
                      bg-orange-500 
                      hover:bg-orange-400
                      text-white 
                      hover:cursor-pointer
                      rounded-3xl 
                      px-6 
                      py-6 
                      flex 
                      items-center 
                      gap-2 
                      transition-all
                    "
                  >
                    <PlusCircle className="h-5 w-5" />
                    Ajouter un enseignants
                  </Button>
                  </Link>

            </div>
    </div>
  )
}

export default Page
