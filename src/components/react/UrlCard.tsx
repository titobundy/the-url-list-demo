import Button from './Button';

interface Url {
  id: number;
  title: string | null;
  description: string | null;
  url: string;
  image: string | null;
  listId: number;
  createdAt: Date;
}

interface UrlCardProps {
  readonly url: Url;
  readonly onDelete: (id: number) => void;
}

export default function UrlCard({ url, onDelete }: Readonly<UrlCardProps>) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {url.title ?? url.url}
          </h3>
          {url.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{url.description}</p>
          )}
          <a 
            href={url.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 truncate block"
          >
            {url.url}
          </a>
        </div>
        <div className="ml-4">
          <Button 
            variant="danger" 
            onClick={() => onDelete(url.id)} 
            className="px-2 py-1 text-sm"
          >
            Delete
          </Button>
        </div>
      </div>
      {url.image && (
        <div className="mt-4 h-32 overflow-hidden rounded-md">
          <img 
            src={url.image} 
            alt={url.title ?? 'URL preview'} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}