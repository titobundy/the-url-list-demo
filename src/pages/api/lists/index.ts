import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { generateSlug } from '../../../utils/urlUtils';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, description, slug = '' } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const finalSlug = slug ? slug : generateSlug(title);

    // Check if slug already exists
    const existingList = await prisma.list.findUnique({
      where: { slug: finalSlug }
    });

    if (existingList) {
      return new Response(JSON.stringify({ error: 'Slug already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create the list
    const list = await prisma.list.create({
      data: {
        title,
        description,
        slug: finalSlug,
      }
    });

    return new Response(JSON.stringify(list), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating list:', error);
    return new Response(JSON.stringify({ error: 'Failed to create list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Get all lists
export const GET: APIRoute = async () => {
  try {
    const lists = await prisma.list.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(lists), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch lists' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};