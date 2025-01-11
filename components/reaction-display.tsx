import { Button } from '@/components/ui/button'

interface ReactionDisplayProps {
  reactions: string[]
  onReactionClick: (emoji: string) => void
}

export default function ReactionDisplay({ reactions, onReactionClick }: ReactionDisplayProps) {
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction] = (acc[reaction] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(reactionCounts).map(([emoji, count]) => (
        <Button
          key={emoji}
          variant="outline"
          size="sm"
          className="py-0 px-2 h-6 text-sm"
          onClick={() => onReactionClick(emoji)}
        >
          {emoji} {count}
        </Button>
      ))}
    </div>
  )
}

