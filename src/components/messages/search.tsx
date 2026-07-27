'use client';

import React from 'react';
import { Search, Inbox, X } from 'lucide-react';
import { Input } from '../ui/input';

type TabType = 'all' | 'unread';

type Props = {
  value: string;
  onSearchChange: (query: string) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
};

const ConversationSearch = ({
  value,
  onSearchChange,
  activeTab,
  onTabChange,
  unreadCount = 0,
}: Props) => {
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  return (
    <div className="flex flex-col gap-3 py-3 px-1">
      {/* Search Bar — entièrement contrôlé par le parent, pas d'état local dupliqué */}
      <div className="relative">
        <div
          className={`
          relative flex items-center rounded-full transition-all duration-200
          ${
            isSearchFocused
              ? 'bg-white border-2 border-orange-500 shadow-none'
              : 'bg-gray-100 border-2 border-transparent'
          }
        `}
        >
          <Search
            className={`
            absolute left-3.5 w-4 h-4 transition-colors duration-200
            ${isSearchFocused ? 'text-orange-500' : 'text-gray-400'}
          `}
          />

          <Input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={value}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="
              pl-10 pr-10 py-2.5 bg-transparent border-0 
              text-sm placeholder:text-gray-400
              focus:ring-0 focus:outline-none focus:border-0
              rounded-full
            "
          />

          {value && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200">
        <button
          type="button"
          onClick={() => onTabChange('all')}
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

        <button
          type="button"
          onClick={() => onTabChange('unread')}
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
  );
};

export default ConversationSearch;