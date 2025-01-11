import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from 'lucide-react'

interface User {
  name: string;
  status: string;
  statusMessage: string;
}

interface AddDirectMessageDialogProps {
  users: User[];
  onAddDirectMessage: (userName: string) => void;
}

export function AddDirectMessageDialog({ users, onAddDirectMessage }: AddDirectMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const lowercaseSearchTerm = searchTerm.toLowerCase()
    const filtered = users.filter(user => 
      user.name && user.name.toLowerCase().includes(lowercaseSearchTerm)
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUserName = searchTerm.trim()
    if (trimmedUserName === '') {
      setError('User name cannot be empty')
      return
    }
    if (!users.some(user => user.name && user.name.toLowerCase() === trimmedUserName.toLowerCase())) {
      setError('User not found')
      return
    }
    onAddDirectMessage(trimmedUserName)
    setSearchTerm('')
    setError('')
    setIsOpen(false)
  }

  const handleUserSelect = (userName: string) => {
    setSearchTerm(userName)
    onAddDirectMessage(userName)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Add Direct Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Direct Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userName" className="text-right">
              User Name
            </Label>
            <Input
              id="userName"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setError('')
              }}
              className="col-span-3"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <ScrollArea className="h-[200px] w-full rounded-md border">
            {filteredUsers.map((user) => (
              <Button
                key={user.name || 'unknown'}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleUserSelect(user.name || '')}
              >
                {user.name || 'Unknown User'}
              </Button>
            ))}
          </ScrollArea>
          <Button type="submit" className="ml-auto">
            Add Direct Message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

