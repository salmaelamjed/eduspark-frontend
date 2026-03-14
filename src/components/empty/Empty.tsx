import React from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

type Props = {
    icon: React.ReactElement,
    title: string, 
    description: string 
}

const EmptyComponent = ({ icon, title, description }: Props) => {
  return (
    <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {icon}
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
    </Empty>
  )
}

export default EmptyComponent