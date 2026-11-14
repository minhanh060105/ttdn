import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { action, reject_reason } = body; // action: 'approve' | 'reject'

  // Tìm và cập nhật trạng thái trong database
  // if (action === 'approve') status = 'published'
  // if (action === 'reject') status = 'rejected', reject_reason = ...

  return NextResponse.json({
    success: true,
    message: action === 'approve' ? 'Phê duyệt xuất bản thành công' : 'Đã từ chối bài viết',
    postId: id
  });
}