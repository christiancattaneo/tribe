import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell } from 'lucide-react'

interface Notification {
  id: number;
  type: 'reaction' | 'reply';
  messageId: number;
  user: string;
  content: string;
  timestamp: string;
}

interface NotificationsDialogProps {
  notifications: Notification[];
}

export function NotificationsDialog({ notifications }: NotificationsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {notifications.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No new notifications</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="mb-4 p-3 bg-gray-100 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{notification.user}</span>
                  <span className="text-sm text-gray-500">{notification.timestamp}</span>
                </div>
                <p className="mt-1">
                  {notification.type === 'reaction'
                    ? `Reacted with ${notification.content} to your message`
                    : `Replied to your message: ${notification.content}`
                  }
                </p>
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

