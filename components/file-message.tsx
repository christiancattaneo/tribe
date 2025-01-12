import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FileMessageProps {
  file: {
    name: string;
    type: string;
    url: string;
  };
}

export default function FileMessage({ file }: FileMessageProps) {
  const [fileData, setFileData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
  const isImage = file.type.startsWith('image/')
  const extensionStyle = defaultStyles[fileExtension as DefaultExtensionType] || {}

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await fetch(file.url)
        if (!response.ok) throw new Error('Failed to load file')
        
        // For images, create an object URL
        if (isImage) {
          const blob = await response.blob()
          const objectUrl = URL.createObjectURL(blob)
          setFileData(objectUrl)
        } else {
          // For other files, just store the URL
          setFileData(file.url)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFileData()
    
    // Cleanup object URL on unmount
    return () => {
      if (fileData && isImage) {
        URL.revokeObjectURL(fileData)
      }
    }
  }, [file.url, isImage])

  if (error) {
    return (
      <div className="p-2 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md">
        Failed to load file: {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse">
        Loading file...
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
      {isImage && fileData ? (
        <div className="relative w-40 h-40">
          <img
            src={fileData}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      ) : (
        <div className="w-10 h-10">
          <FileIcon
            extension={fileExtension}
            {...extensionStyle}
          />
        </div>
      )}
      <div className="flex-grow">
        <p className="font-medium text-sm">{file.name}</p>
        <p className="text-xs text-gray-500">{file.type}</p>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
          <Download className="h-4 w-4 mr-1" />
          Download
        </a>
      </Button>
    </div>
  )
}

