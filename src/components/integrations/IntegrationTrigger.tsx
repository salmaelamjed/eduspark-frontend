import React from 'react'
import { Card } from '../ui/card'
import { CloudIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import Modal from '../modal'
import IntegrationModalBody from '../modal/integration-modal-body'

type Props = {
    name: string
    logo: string 
    title: string 
    description: string 
    connections: {
        stripe: boolean
    } 
}

const IntegrationTrigger = ({ name, logo, title, description, connections }: Props) => {
  const isStripe = name === "stripe"
  const isConnected = isStripe ? connections.stripe : false

  return (
    <Modal 
      title={title}
      type="Integration"
      logo={logo}
      description={description}
      trigger={
        <Card className='px-4 py-2 cursor-pointer flex flex-row items-center gap-2 whitespace-nowrap'>
            <CloudIcon size={23} /> 
            <span>{isConnected ? 'connected' : 'connect'}</span>
        </Card>
      }
    >
      <Separator orientation='horizontal'/>
      <IntegrationModalBody
        connections={connections}
        type={name}
      />
    </Modal>
  )
}

export default IntegrationTrigger