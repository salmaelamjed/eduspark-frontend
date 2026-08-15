"use client" 

import { use } from "react" 

interface PageProps {
  params: Promise<{ slug: string }> 
}

export default function DomainPage({ params }: PageProps) {
  const { slug } = use(params)


  return (
    <div>
      <h1>Domain: {slug}</h1>
      {/* Your domain detail content */}
    </div>
  )
}