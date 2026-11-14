import { NextResponse } from 'next/server';


let posts = [
  {
    id: 1,
    title: "Building High-Performance Web Applications with Next.js 15",
    slug: "building-high-performance-nextjs-15",
    content: "<p>Server Components in Next.js revolutionize the mental model of React developers...</p>",
    thumbnail_url: "https://picsum.photos/seed/nextjs/800/450",
    author_id: 3,
    language_id: 2,
    status: "published",
    views_count: 1240,
    published_at: "2026-03-15T09:00:00Z"
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'vi';
  const status = searchParams.get('status') || 'published';
  const langId = lang === 'en' ? 2 : 1;

  let filtered = posts.filter(p => p.status === status && p.language_id === langId);

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost = {
      id: Date.now(),
      ...body,
      status: 'pending', // Bài viết mới tạo luôn ở trạng thái pending chờ Admin duyệt
      views_count: 0,
      created_at: new Date().toISOString()
    };
    posts.unshift(newPost);

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tạo bài viết' }, { status: 500 });
  }
}