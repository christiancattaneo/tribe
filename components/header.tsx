'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, HelpCircle, Bell } from 'lucide-react'
import { HelpDialog } from './help-dialog'
import { NotificationsDialog } from './notifications-dialog'
import { Notification } from '@/lib/types'
import { User } from '@/lib/types'

interface HeaderProps {
  notifications: Notification[];
  clearSearch: () => void;
  currentUser: User;
  onLogout: () => void;
}

export default function Header({ notifications, clearSearch, currentUser, onLogout }: HeaderProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-end gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

