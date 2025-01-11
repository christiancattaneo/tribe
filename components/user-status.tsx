'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Circle, Send } from 'lucide-react'

interface StatusOption {
  label: string;
  value: string;
  color: string;
}

interface UserStatusProps {
  onStatusChange: (status: string, statusMessage: string) => void;
}

const statusOptions: StatusOption[] = [
  { label: 'Online', value: 'online', color: 'bg-green-500' },
  { label: 'Away', value: 'away', color: 'bg-yellow-500' },
  { label: 'Do Not Disturb', value: 'do-not-disturb', color: 'bg-red-500' },
  { label: 'Offline', value: 'offline', color: 'bg-gray-500' },
]

export default function UserStatus({ onStatusChange }: UserStatusProps) {
  const [status, setStatus] = useState<StatusOption>(statusOptions[0])
  const [statusMessage, setStatusMessage] = useState('')

  const handleStatusChange = (newStatus: StatusOption) => {
    setStatus(newStatus)
  }

  const handleStatusMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(e.target.value)
  }

  const handleSubmit = () => {
    onStatusChange(status.value, statusMessage)
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-32">
            <Circle className={`h-2 w-2 mr-2 ${status.color}`} />
            {status.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statusOptions.map((option) => (
            <DropdownMenuItem key={option.value} onSelect={() => handleStatusChange(option)}>
              <Circle className={`h-2 w-2 mr-2 ${option.color}`} />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        type="text"
        placeholder="Set a status message"
        value={statusMessage}
        onChange={handleStatusMessageChange}
        className="w-64"
      />
      <Button variant="ghost" size="icon" onClick={handleSubmit}>
        <Send className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

