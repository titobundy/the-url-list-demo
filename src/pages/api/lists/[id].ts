import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Invalid list ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const list = await prisma.list.findUnique({
      where: { id: Number(id) }
    });

    if (!list) {
      return new Response(JSON.stringify({ error: 'List not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(list), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Delete a list
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Invalid list ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // First delete all URLs in the list
    await prisma.url.deleteMany({
      where: { listId: Number(id) }
    });

    // Then delete the list
    await prisma.list.delete({
      where: { id: Number(id) }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting list:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};