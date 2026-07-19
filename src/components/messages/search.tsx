'use client';

import React, { useState } from 'react'

import { FieldValues, UseFormReturn } from 'react-hook-form'
import { Search,Inbox, X } from 'lucide-react'
import { Input } from "../ui/input"

type Domain = {
  name: string 
  id: string 
  icon: string 
}

type Props = {
  form: UseFormReturn<FieldValues>
  domains?: Domain[] | undefined
  onTabChange?: (tab: string) => void
  onSearch?: (query: string) => void
  unreadCount?: number
  favoritesCount?: number
  groupsCount?: number
}

type TabType = 'all' | 'unread' | 'favorites' 

const ConversationSearch = ({ 

  onTabChange,
  onSearch,
  unreadCount = 22,

}: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (onTabChange) onTabChange(tab)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) onSearch(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
    if (onSearch) onSearch('')
  }

  return (
    <div className="flex flex-col gap-3 py-3 px-1">
      {/* Search Bar */}
      <div className="relative">
        <div className={`
          relative flex items-center rounded-full transition-all duration-200
          ${isSearchFocused 
            ? 'bg-white border-2 border-orange-500 shadow-none' 
            : 'bg-gray-100 border-2 border-transparent'
          }
        `}>
          <Search className={`
            absolute left-3.5 w-4 h-4 transition-colors duration-200
            ${isSearchFocused ? 'text-orange-500' : 'text-gray-400'}
          `} />
          
          <Input
            type="text"
            placeholder="Rechercher ou démarrer une discussion"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="
              pl-10 pr-10 py-2.5 bg-transparent border-0 
              text-sm placeholder:text-gray-400
              focus:ring-0 focus:outline-none focus:border-0
              rounded-full
            "
          />
          
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs - Exact WhatsApp Style with Orange Underline */}
      <div className="flex items-center border-b border-gray-200">
        {/* All */}
        <button
          onClick={() => handleTabChange('all')}
          className={`
            relative flex-1 py-2.5 text-xs font-medium transition-all duration-200
            ${activeTab === 'all' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Inbox className="w-4 h-4" />
            <span>Toutes</span>
          </div>
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
          )}
        </button>

        {/* Unread */}
        <button
          onClick={() => handleTabChange('unread')}
          className={`
            relative flex-1 py-2.5 text-xs font-medium transition-all duration-200
            ${activeTab === 'unread' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span>Non lues</span>
            <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5">
              {unreadCount}
            </span>
          </div>
          {activeTab === 'unread' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
          )}
        </button>
      </div>


    </div>
  )
}

export default ConversationSearch