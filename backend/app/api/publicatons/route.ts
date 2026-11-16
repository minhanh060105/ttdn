import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID publication' }, { status: 400 });
    }

    const publication = await prisma.publications.findUnique({
      where: { id: BigInt(id) },
      include: {
        posts: {
          where: { status: 'published' },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!publication) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy ấn phẩm' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      publication
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}