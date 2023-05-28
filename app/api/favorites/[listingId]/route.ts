import { getCurrentUser } from '@/app/actions';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';

interface Params {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  // ! Should not return hashedPassword here: return NextResponse.json(user);
  return NextResponse.json({ favoriteIds: user.favoriteIds });
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  // ! Should not return hashedPassword here: return NextResponse.json(user);
  return NextResponse.json({ favoriteIds: user.favoriteIds });
}