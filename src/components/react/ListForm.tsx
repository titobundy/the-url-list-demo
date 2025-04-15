import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import Input from './Input';
import Button from './Button';
import { customSlug, isLoading, errorMessage } from '../../stores/listStore';

export default function ListForm() {
  const $customSlug = useStore(customSlug);
  const $isLoading = useStore(isLoading);
  const $errorMessage = useStore(errorMessage);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim()) {
      errorMessage.set('Please enter a title for your list');
      return;
    }

    try {
      isLoading.set(true);
      
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          description, 
          slug: $customSlug 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to the newly created list
        window.location.href = `/lists/${data.slug}`;
      } else {
        errorMessage.set(data.error ?? 'Failed to create list');
      }
    } catch (error) {
      console.error('Error creating list:', error);
      errorMessage.set('Something went wrong. Please try again.');
    } finally {
      isLoading.set(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="List Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        placeholder="My Awesome Link Collection"
        required
      />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e: JSX.TargetedEvent<HTMLTextAreaElement>) => setDescription(e.currentTarget.value)}
          placeholder="A brief description of your list"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>
      
      <Input
        label="Custom Slug (optional)"
        name="slug"
        value={$customSlug}
        onChange={(e) => customSlug.set(e.currentTarget.value)}
        placeholder="my-awesome-links"
      />
      
      {$errorMessage && (
        <p className="text-red-500 text-sm">{$errorMessage}</p>
      )}
      
      <Button 
        type="submit" 
        disabled={$isLoading || !title.trim()}
      >
        {$isLoading ? 'Creating...' : 'Create List'}
      </Button>
    </form>
  );
}