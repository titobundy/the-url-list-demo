import type { APIRoute } from 'astro';
import prisma from '../../../../../lib/prisma';

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { urlId } = params;
    
    if (!urlId || isNaN(Number(urlId))) {
      return new Response(JSON.stringify({ error: 'Invalid URL ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the URL
    await prisma.url.delete({
      where: { id: Number(urlId) }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};