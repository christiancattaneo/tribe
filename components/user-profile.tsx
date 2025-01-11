import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Circle, Camera, Send } from 'lucide-react'
import { User } from '@/lib/types'

interface UserProfileProps {
  user: User;
  onStatusChange: (status: string, statusMessage: string) => void;
  onProfileImageChange?: (file: File) => Promise<void>;
}

export default function UserProfile({ user, onStatusChange, onProfileImageChange }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(user.status)
  const [statusMessage, setStatusMessage] = useState(user.statusMessage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }

  const handleStatusMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(event.target.value)
  }

  const handleSendStatus = () => {
    onStatusChange(status, statusMessage)
    setIsOpen(false)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onProfileImageChange) {
      await onProfileImageChange(file)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative group">
        <Avatar className="cursor-pointer" onClick={handleImageClick}>
          <AvatarImage src={user.profileImage || `https://avatar.vercel.sh/${user.name}.png`} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleImageClick}>
          <Camera className="h-4 w-4 text-white" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div className="flex-1">
        <div className="font-medium">{user.name}</div>
        <div className="text-xs text-gray-400">{user.statusMessage || 'Set a status'}</div>
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Circle className={`h-4 w-4 ${
              status === 'online' ? 'text-green-500' :
              status === 'away' ? 'text-yellow-500' :
              status === 'busy' ? 'text-red-500' :
              'text-gray-500'
            }`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Set Status</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleStatusChange('online')}>
            <Circle className="h-4 w-4 text-green-500 mr-2" />
            Online
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('away')}>
            <Circle className="h-4 w-4 text-yellow-500 mr-2" />
            Away
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('busy')}>
            <Circle className="h-4 w-4 text-red-500 mr-2" />
            Do Not Disturb
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="p-2 flex gap-2">
            <Input
              placeholder="What's your status?"
              value={statusMessage}
              onChange={handleStatusMessageChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSendStatus()
                }
              }}
            />
            <Button variant="ghost" size="icon" onClick={handleSendStatus}>
              <Send className="h-4 w-4 text-black" />
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

