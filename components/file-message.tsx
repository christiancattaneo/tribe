import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface FileMessageProps {
  file: {
    name: string;
    type: string;
    url: string;
  };
}

export default function FileMessage({ file }: FileMessageProps) {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
  const isImage = file.type.startsWith('image/')
  const extensionStyle = defaultStyles[fileExtension as DefaultExtensionType] || {}

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
      {isImage ? (
        <div className="relative w-40 h-40">
          <img
            src={file.url}
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

