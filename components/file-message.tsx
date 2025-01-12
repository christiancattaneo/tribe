import { FileIcon, defaultStyles } from 'react-file-icon'
import { useState } from 'react'

interface FileMessageProps {
  file: {
    id: string
    name: string
    type: string
    url: string
  }
}

export default function FileMessage({ file }: FileMessageProps) {
  const [error, setError] = useState(false)
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const isImage = file.type.startsWith('image/')

  return (
    <div className="flex items-center gap-2 mt-2">
      {isImage ? (
        <img 
          src={file.url}
          alt={file.name}
          className="max-w-[200px] max-h-[200px] rounded"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-8">
          <FileIcon 
            extension={extension} 
            {...defaultStyles[extension as keyof typeof defaultStyles]} 
          />
        </div>
      )}
      <a 
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
        download={file.name}
      >
        {file.name}
      </a>
    </div>
  )
}

