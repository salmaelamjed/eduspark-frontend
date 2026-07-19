'use client'
import React from 'react'
import ConversationSearch from './search'
import { CardDescription } from '../ui/card'
import ChatCard from './chat-card'
import { useForm } from 'react-hook-form'
import { Form } from "../ui/form";

// Structure des données factices pour les cartes de discussion
export interface FakeChatData {
  id: string
  title: string
  description: string
  createdAt: Date
  seen: boolean
  unreadCount?: number
  isPinned?: boolean
  isMuted?: boolean
}

// Les fausses Chat Cards (Mock Data)
const MOCK_CHATS: FakeChatData[] = [
  {
    id: "chat-1",
    title: "Amine Benjelloun",
    description: "Bonjour, j'aimerais avoir plus d'informations sur le cours Next.js s'il vous plaît.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // Il y a 5 minutes
    seen: false,
    unreadCount: 3,
    isPinned: true,
  },
  {
    id: "chat-2",
    title: "Sarah Connor",
    description: "Le paiement a bien été validé de mon côté ! Merci pour votre réactivité.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2 heures
    seen: true,
    unreadCount: 0,
  },
  {
    id: "chat-3",
    title: "Support Technique",
    description: "", // Test du fallback "This chatroom is empty"
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // Hier
    seen: true,
    unreadCount: 0,
    isMuted: true,
  },
  {
    id: "chat-4",
    title: "Youssef El Amrani",
    description: "Est-ce qu'une certification est délivrée à la fin de la formation ?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // Il y a 3 jours
    seen: false,
    unreadCount: 1,
  },
  {
    id: "chat-5",
    title: "Groupe Dev React",
    description: "✅ Safe rah 3tithom lih",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // Il y a 5 heures
    seen: false,
    unreadCount: 8,
    isMuted: false,
  }
]

type Props = {
  domains?:
    | {
        name: string
        id: string
        icon: string
      }[]
    | undefined
}

const ConversationMenu = ({ domains }: Props) => {
  // Create form instance for the search
  const form = useForm({
    defaultValues: {
      domain: 'all'
    }
  })

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    console.log(`Tab changed to: ${tab}`)
    // You can implement filtering logic here
  }

  // Handle search
  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`)
    // You can implement search logic here
  }

  // Fonction fictive appelée lors du clic sur une carte
  const handleChatClick = (id: string) => {
    console.log(`Ouverture du chat : ${id}`)
  }

  // Count unread messages
  const unreadCount = MOCK_CHATS.filter(chat => !chat.seen).reduce(
    (total, chat) => total + (chat.unreadCount || 0), 
    0
  )

  // Count groups
  const groupsCount = MOCK_CHATS.filter(chat => 
    chat.title.toLowerCase().includes('groupe') || 
    chat.title.toLowerCase().includes('group')
  ).length

  return (
    <div className="flex flex-col h-full gap-3 p-4 bg-white rounded-xl border border-gray-100">
      {/* En-tête / Recherche */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-gray-900">Discussions</h3>
        <CardDescription>Gérez vos conversations récentes</CardDescription>
        
        <Form {...form}>
          <ConversationSearch
            onTabChange={handleTabChange}
            onSearch={handleSearch}
            unreadCount={unreadCount}
          />
        </Form>
      </div>

      {/* Rendu de la liste des fausses cartes */}
      <div className="flex flex-col gap-1 overflow-y-auto pr-1 max-h-[600px] custom-scrollbar">
        {MOCK_CHATS.map((chat) => (
          <ChatCard
            key={chat.id}
            id={chat.id}
            title={chat.title}
            description={chat.description}
            createdAt={chat.createdAt}
            seen={chat.seen}
            unreadCount={chat.unreadCount || 0}
            isPinned={chat.isPinned || false}
            isMuted={chat.isMuted || false}
            onChat={() => handleChatClick(chat.id)}
          />
        ))}
      </div>

      {/* Footer with stats */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
        <span className="text-xs text-gray-400">
          {MOCK_CHATS.length} discussions
        </span>
        <span className="text-xs text-orange-500 font-medium">
          {unreadCount} non lues
        </span>
      </div>
    </div>
  )
}

export default ConversationMenu