import { atom, map } from 'nanostores';
import type { List, Url } from '@prisma/client';

// Store for the current list being viewed or edited
export const currentList = map<List | null>(null);

// Store for URLs in the current list
export const listUrls = atom<Url[]>([]);

// Store for new URL input
export interface NewUrlInput {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export const newUrl = map<NewUrlInput>({
  url: '',
  title: '',
  description: '',
  image: ''
});

// Store for custom slug input
export const customSlug = atom<string>('');

// Store for loading state
export const isLoading = atom<boolean>(false);

// Store for error messages
export const errorMessage = atom<string | null>(null);

// Actions
export function resetForm() {
  newUrl.set({
    url: '',
    title: '',
    description: '',
    image: ''
  });
  errorMessage.set(null);
}

export function resetStores() {
  currentList.set(null);
  listUrls.set([]);
  resetForm();
  customSlug.set('');
  isLoading.set(false);
  errorMessage.set(null);
}