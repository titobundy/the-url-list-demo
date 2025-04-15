import type { APIRoute } from 'astro';
import prisma from '../../../../../lib/prisma';
import { isValidUrl, normalizeUrl, extractUrlMetadata } from '../../../../../utils/urlUtils';

// Add a URL to a list
export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Invalid list ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { url, title: providedTitle, description: providedDescription, image: providedImage } = body;

    if (!url || !isValidUrl(url)) {
      return new Response(JSON.stringify({ error: 'Valid URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the list exists
    const listExists = await prisma.list.findUnique({
      where: { id: Number(id) },
      select: { id: true }
    });

    if (!listExists) {
      return new Response(JSON.stringify({ error: 'List not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedUrl = normalizeUrl(url);
    
    let title = providedTitle;
    let description = providedDescription;
    let image = providedImage;

    // If metadata is not provided by user, try to extract it from the URL
    if (!title || !description || !image) {
      try {
        const metadata = await extractUrlMetadata(normalizedUrl);
        console.log('Extracted metadata:', metadata);
        title = title || metadata.title;
        description = description || metadata.description;
        image = image || metadata.image;
      } catch (error) {
        console.error('Error extracting URL metadata:', error);
        // Continue with user-provided data only
      }
    }

    // Create the URL entry with explicit error handling
    let urlEntry;
    try {
      urlEntry = await prisma.url.create({
        data: {
          url: normalizedUrl,
          title,
          description,
          image,
          listId: Number(id)
        }
      });
    } catch (dbError) {
      console.error('Database error creating URL:', dbError);
      return new Response(JSON.stringify({ error: 'Database error while saving URL' }), {
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log successful creation
    console.log('Successfully added URL:', urlEntry.id);

    return new Response(JSON.stringify(urlEntry), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adding URL:', error);
    return new Response(JSON.stringify({ error: 'Failed to add URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Get all URLs in a list
export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Invalid list ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const urls = await prisma.url.findMany({
      where: { listId: Number(id) },
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify(urls), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch URLs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};