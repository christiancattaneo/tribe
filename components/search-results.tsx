import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { FileIcon, defaultStyles } from 'react-file-icon'
import { Message, ThreadMessage } from '@/lib/types'

interface SearchResultsProps {
  results: (Message | ThreadMessage)[];
  onResultClick: (result: Message | ThreadMessage) => void;
  onClearSearch: () => void;
}

export default function SearchResults({ results, onResultClick }: SearchResultsProps) {
  return (
    <div className="flex-grow flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Search Results</h2>
      </div>
      <ScrollArea className="flex-grow p-4">
        {results.map((result) => (
          <div key={result.id} className="mb-4 p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex items-start">
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${result.user}`}
                alt={`${result.user}'s avatar`}
                className="w-10 h-10 rounded mr-3"
              />
              <div className="flex-grow">
                <div className="flex items-center">
                  <span className="font-semibold">{result.user}</span>
                  <span className="text-gray-400 text-sm ml-2">
                    {result.timestamp}
                  </span>
                </div>
                <p>{result.content}</p>
                {'file' in result && result.file && (
                  <div className="mt-2 flex items-center">
                    <div className="w-6 h-6 mr-2">
                      <FileIcon
                        extension={result.file.name.split('.').pop() || ''}
                        {...(defaultStyles[result.file.name.split('.').pop() as keyof typeof defaultStyles] || {})}
                      />
                    </div>
                    <span className="text-sm text-blue-500">{result.file.name}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => onResultClick(result)}
                >
                  Go to message
                </Button>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

