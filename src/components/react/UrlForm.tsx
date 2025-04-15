import type { JSX } from 'preact';
import { useStore } from '@nanostores/preact';
import { newUrl, errorMessage, isLoading, type NewUrlInput } from '../../stores/listStore';
import { isValidUrl } from '../../utils/urlUtils';
import Input from './Input';
import Button from './Button';

interface UrlFormProps {
  readonly onSubmit: (urlData: NewUrlInput) => Promise<void>;
}

export default function UrlForm({ onSubmit }: UrlFormProps) {
  const $newUrl = useStore(newUrl);
  const $errorMessage = useStore(errorMessage);
  const $isLoading = useStore(isLoading);

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!$newUrl.url.trim()) {
      errorMessage.set('Please enter a URL');
      return;
    }

    if (!isValidUrl($newUrl.url)) {
      errorMessage.set('Please enter a valid URL');
      return;
    }

    try {
      isLoading.set(true);
      await onSubmit($newUrl);
      // Form reset happens through the store
    } catch (error) {
      console.error('Error adding URL:', error);
      errorMessage.set('Failed to add URL. Please try again.');
    } finally {
      isLoading.set(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="URL"
        placeholder="https://example.com"
        value={$newUrl.url}
        onChange={(e) => newUrl.set({ ...$newUrl, url: e.currentTarget.value })}
        required
      />
      
      <Input
        label="Title (optional)"
        placeholder="Page Title"
        value={$newUrl.title || ''}
        onChange={(e) => newUrl.set({ ...$newUrl, title: e.currentTarget.value })}
      />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={$newUrl.description || ''}
          onChange={(e: JSX.TargetedEvent<HTMLTextAreaElement>) => 
            newUrl.set({ ...$newUrl, description: e.currentTarget.value })
          }
          placeholder="A brief description of the link"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>
      
      <Input
        label="Image URL (optional)"
        placeholder="https://example.com/image.jpg"
        value={$newUrl.image || ''}
        onChange={(e) => newUrl.set({ ...$newUrl, image: e.currentTarget.value })}
      />
      
      {$errorMessage && (
        <p className="text-red-500 text-sm mt-2">{$errorMessage}</p>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={$isLoading || !$newUrl.url.trim()}
          className="whitespace-nowrap"
        >
          {$isLoading ? 'Adding...' : 'Add URL'}
        </Button>
      </div>
    </form>
  );
}