import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User } from "@/lib/types"

interface SelectUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSelectUser: (userName: string) => void;
  currentUser: User;
}

export function SelectUserDialog({ isOpen, onClose, users, onSelectUser, currentUser }: SelectUserDialogProps) {
  if (!currentUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="select-user-description">
        <DialogHeader>
          <DialogTitle>Select User for Direct Message</DialogTitle>
        </DialogHeader>
        <div id="select-user-description" className="sr-only">
          Select a user to start a direct message conversation with
        </div>
        <ScrollArea className="mt-4 max-h-[300px]">
          <div className="space-y-2">
            {users
              .filter(user => user.id !== currentUser.id)
              .map(user => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded"
                  onClick={() => onSelectUser(user.name)}
                >
                  {user.name}
                </div>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

