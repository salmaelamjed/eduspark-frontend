import { Inbox, Mail, MessageCircle, BookOpen, ShieldAlert } from 'lucide-react'
import React from 'react'

type CategoryType = 'all' | 'unread' | 'chat' | 'course' | 'security';

type Props = {
  value: string;
  onSearchChange: (query: string) => void;
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  unreadCount?: number;
};

const NotificationsCategories = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}: Props) => {
  const tabs: {
    key: CategoryType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { key: 'all', label: 'Toutes', icon: Inbox },
    { key: 'unread', label: 'Non lues', icon: Mail, badge: unreadCount },
    { key: 'chat', label: 'Messages', icon: MessageCircle },
    { key: 'course', label: 'Cours', icon: BookOpen },
    { key: 'security', label: 'Sécurité', icon: ShieldAlert },
  ];

  return (
    <div className="flex items-center border-b border-gray-200 overflow-x-auto">
      {tabs.map(({ key, label, icon: Icon, badge }) => {
        const isActive = activeTab === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={`
              relative flex-1 py-2.5 px-2 text-xs font-medium whitespace-nowrap transition-all duration-200 hover:cursor-pointer
              ${isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {typeof badge === 'number' && badge > 0 && (
                <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5">
                  {badge}
                </span>
              )}
            </div>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationsCategories