import { useStore } from '@nanostores/preact';
import { useEffect, useState } from 'preact/hooks';
import { currentList, listUrls, isLoading, resetForm, type NewUrlInput, errorMessage } from '../../stores/listStore';
import UrlCard from './UrlCard';
import UrlForm from './UrlForm';
import Button from './Button';

interface ListViewProps {
  readonly listId: number;
}

export default function ListView({ listId }: Readonly<ListViewProps>) {
  const $currentList = useStore(currentList);
  const $listUrls = useStore(listUrls);
  const $isLoading = useStore(isLoading);
  const [localLoading, setLocalLoading] = useState(true);

  // If we still don't have data after a timeout, fetch it directly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!$currentList) {
        fetchListData();
      } else {
        setLocalLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [$currentList]);

  // Update loading state when currentList changes
  useEffect(() => {
    if ($currentList) {
      setLocalLoading(false);
    }
  }, [$currentList]);

  // Fetch list data directly from API
  const fetchListData = async () => {
    try {
      const response = await fetch(`/api/lists/${listId}`);
      if (response.ok) {
        const data = await response.json();
        currentList.set(data);
        
        // Also fetch URLs
        const urlsResponse = await fetch(`/api/lists/${listId}/urls`);
        if (urlsResponse.ok) {
          const urls = await urlsResponse.json();
          listUrls.set(urls);
        }
      }
      setLocalLoading(false);
    } catch (error) {
      console.error('Error fetching list data:', error);
      setLocalLoading(false);
    }
  };

  // Direct API call for adding a URL - more reliable than using window global functions
  const handleAddUrl = async (urlData: NewUrlInput) => {
    if (!$currentList) return;
    
    try {
      isLoading.set(true);
      errorMessage.set(null);
      
      const response = await fetch(`/api/lists/${$currentList.id}/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(urlData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add URL');
      }

      const newUrl = await response.json();
      
      // Update the URLs store with the new URL
      listUrls.set([newUrl, ...listUrls.get()]);
      resetForm();
      
    } catch (error) {
      console.error('Error adding URL:', error);
      errorMessage.set(error instanceof Error ? error.message : 'Failed to add URL. Please try again.');
    } finally {
      isLoading.set(false);
    }
  };

  // Direct API call for deleting a URL
  const handleDeleteUrl = async (id: number) => {
    if (!$currentList) return;
    
    if (confirm('Are you sure you want to delete this URL?')) {
      try {
        isLoading.set(true);
        
        const response = await fetch(`/api/lists/${$currentList.id}/urls/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete URL');
        }
        
        // Update the URLs store by removing the deleted URL
        const updatedUrls = $listUrls.filter(url => url.id !== id);
        listUrls.set(updatedUrls);
        
      } catch (error) {
        console.error('Error deleting URL:', error);
        errorMessage.set(error instanceof Error ? error.message : 'Failed to delete URL. Please try again.');
      } finally {
        isLoading.set(false);
      }
    }
  };

  // Handle sharing the list
  const handleShare = () => {
    const url = window.location.href;
    
    // Use the Clipboard API to copy the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('List URL copied to clipboard!');
      })
      .catch(() => {
        // Fallback
        prompt('Copy this link to share your list:', url);
      });
  };

  return (
    <div className="space-y-8">
      {localLoading ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Loading list...</p>
        </div>
      ) : $currentList ? (
        <>
          <div className="border-b pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{$currentList.title}</h1>
                {$currentList.description && (
                  <p className="mt-2 text-gray-600">{$currentList.description}</p>
                )}
              </div>
              <Button onClick={handleShare} variant="secondary">
                Share List
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New URL</h2>
            <UrlForm onSubmit={handleAddUrl} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">URLs in this List</h2>
            {$isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : $listUrls.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {$listUrls.map((url) => (
                  <div key={url.id}>
                    <UrlCard url={url} onDelete={handleDeleteUrl} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No URLs in this list yet. Add some above!</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-red-50 rounded-lg">
          <p className="text-red-500">Sorry, we couldn't load this list. It may have been deleted or doesn't exist.</p>
          <Button 
            onClick={() => window.location.href = '/'} 
            className="mt-4"
          >
            Return to Home
          </Button>
        </div>
      )}
    </div>
  );
}