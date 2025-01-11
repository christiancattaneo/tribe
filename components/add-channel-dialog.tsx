import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from 'lucide-react'

interface AddChannelDialogProps {
  onAddChannel: (name: string) => void;
}

export function AddChannelDialog({ onAddChannel }: AddChannelDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [channelName, setChannelName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (channelName.trim()) {
      onAddChannel(channelName.trim())
      setChannelName('')
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 text-gray-400 hover:text-white" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <Button type="submit">Create Channel</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

