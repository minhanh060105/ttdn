import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 1. GET: Lấy danh sách bài viết từ MySQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('author_id');
    const status = searchParams.get('status');

    const where: any = {};
    if (authorId) {
      where.author_id = BigInt(authorId);
    }
    if (status) {
      where.status = status;
    }

    const posts = await prisma.posts.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        categories: true,
        languages: true
      }
    });

    // Chuyển đổi BigInt sang string để trả về JSON an toàn
    const serialized = posts.map(p => ({
      ...p,
      id: p.id.toString(),
      author_id: p.author_id.toString(),
      publication_id: p.publication_id.toString(),
      reviewed_by: p.reviewed_by ? p.reviewed_by.toString() : null
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error: any) {
    console.error('Lỗi GET /api/posts:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. POST: Lưu bài viết mới vào MySQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, content_html, cover_image, thumbnail_url, category_id, language_id, author_id, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: 'Tiêu đề không được để trống.' }, { status: 400 });
    }

    // Tạo slug từ tiêu đề
    const rawSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const uniqueSlug = `${rawSlug}-${Date.now().toString().slice(-4)}`;

    // Xử lý an toàn độ dài thumbnail tránh lỗi P2000
    let safeThumb: string | null = null;
    const rawThumb = thumbnail_url || cover_image;
    if (rawThumb && typeof rawThumb === 'string' && rawThumb.length <= 500) {
      safeThumb = rawThumb.trim();
    }

    // Đảm bảo author_id hợp lệ
    const validAuthorId = BigInt(author_id || 2);

    // Lấy hoặc tạo publication_id cho tác giả
    let pub = await prisma.publications.findFirst({
      where: { owner_id: validAuthorId }
    });
    if (!pub) {
      pub = await prisma.publications.create({
        data: {
          owner_id: validAuthorId,
          name: `Bản tin cá nhân`,
          slug: `newsletter-${validAuthorId}-${Date.now().toString().slice(-4)}`
        }
      });
    }

    // Ghi trực tiếp vào MySQL bằng ID khóa ngoại
    const newPost = await prisma.posts.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        content: content || content_html || '',
        thumbnail_url: safeThumb,
        status: status || 'pending', // Mặc định chờ duyệt hoặc published
        published_at: status === 'published' ? new Date() : null,
        author_id: validAuthorId,
        publication_id: pub.id,
        category_id: Number(category_id || 1),
        language_id: Number(language_id || 1)
      }
    });

    const serialized = {
      ...newPost,
      id: newPost.id.toString(),
      author_id: newPost.author_id.toString(),
      publication_id: newPost.publication_id.toString(),
      reviewed_by: newPost.reviewed_by ? newPost.reviewed_by.toString() : null
    };

    return NextResponse.json({
      success: true,
      message: 'Lưu bài viết vào MySQL thành công!',
      data: serialized
    }, { status: 201 });

  } catch (error: any) {
    console.error('Lỗi POST /api/posts:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}