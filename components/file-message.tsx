import { FileIcon, defaultStyles } from 'react-file-icon'

interface FileMessageProps {
  file: {
    id: string
    name: string
    type: string
    url: string
  }
}

export function FileMessage({ file }: FileMessageProps) {
  if (!file || !file.name || !file.type || !file.url) {
    return <div className="p-2 text-sm text-red-500">Invalid file data</div>
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const isImage = file.type.startsWith('image/')

  return (
    <div className="flex items-center gap-2 p-2 rounded bg-gray-100">
      {isImage ? (
        <img 
          src={file.url} 
          alt={file.name}
          className="max-w-[200px] max-h-[200px] rounded"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
            e.currentTarget.className = 'hidden'
          }}
        />
      ) : (
        <div className="w-8 h-8">
          <FileIcon 
            extension={extension}
            {...(defaultStyles[extension as keyof typeof defaultStyles] || {})}
          />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium">{file.name}</span>
        <span className="text-xs text-gray-500">{file.type}</span>
      </div>
      {file.url && (
        <a
          href={file.url}
          download={file.name}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-blue-500 hover:text-blue-600"
        >
          Download
        </a>
      )}
    </div>
  )
}

