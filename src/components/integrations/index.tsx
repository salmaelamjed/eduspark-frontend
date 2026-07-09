import { INTEGRATION_LIST_ITEMS } from '../../constants/intagrations'
import { Card, CardContent, CardDescription } from '../ui/card'
import Image from 'next/image'
import IntegrationTrigger from './IntegrationTrigger'


type Props={
    connections:{
        stripe : boolean
    }
}
const IntegrationsList = ({connections}:Props) => {
  return (
    <div className="flex-1 h-0 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {INTEGRATION_LIST_ITEMS.map((item) => (
    <Card key={item.id} className="w-full">
      <CardContent className="flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <div className="w-20 h-20 relative">
            <Image
              src="/images/stripe.png"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
          <IntegrationTrigger
            connections={connections}
            title={item.title}
            description={item.description}
            logo={item.logo}
            name={item.name}
          />
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
    </Card>
  ))}
</div>

  )
}

export default IntegrationsList
