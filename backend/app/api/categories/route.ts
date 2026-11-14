import { NextResponse } from 'next/server';


let categories = [
  { id: 1, name: 'Công nghệ & Lập trình', slug: 'cong-nghe', posts_count: 12, description: 'Chia sẻ kiến trúc hệ thống, web...' },
  { id: 2, name: 'Trí tuệ nhân tạo (AI)', slug: 'tri-tue-nhan-tao', posts_count: 8, description: 'LLM, Prompt Engineering, Agent...' },
  { id: 3, name: 'Khởi nghiệp & Kinh doanh', slug: 'kinh-doanh', posts_count: 5, description: 'SaaS, Product-market fit...' }
];

export async function GET() {
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: 'Tên và slug không được để trống' }, { status: 400 });
    }

    const newCategory = {
      id: Date.now(),
      name,
      slug,
      description: description || '',
      posts_count: 0
    };

    categories.push(newCategory);
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}