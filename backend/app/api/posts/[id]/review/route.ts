import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Khai báo params là Promise theo Next.js 15
) {
  try {
    // 1. Un دول (await) params trước khi truy cập id
    const { id } = await params;
    const postId = BigInt(id);

    const body = await request.json();
    const { action, reject_reason, reviewer_id } = body; 
    // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Hành động không hợp lệ (chỉ chấp nhận approve hoặc reject).' },
        { status: 400 }
      );
    }

    const reviewerId = BigInt(reviewer_id || 1);

    const updateData: any = {
      reviewed_by: reviewerId,
      reviewed_at: new Date()
    };

    if (action === 'approve') {
      updateData.status = 'published';
      updateData.published_at = new Date();
      updateData.reject_reason = null;
    } else {
      updateData.status = 'rejected';
      updateData.reject_reason = reject_reason || 'Nội dung vi phạm tiêu chuẩn cộng đồng.';
    }

    // 2. Cập nhật trạng thái bài viết trong MySQL
    const updatedPost = await prisma.posts.update({
      where: { id: postId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'Đã phê duyệt bài viết thành công!' : 'Đã từ chối bài viết!',
      data: {
        id: updatedPost.id.toString(),
        status: updatedPost.status,
        reject_reason: updatedPost.reject_reason
      }
    });

  } catch (error: any) {
    console.error('Lỗi khi duyệt bài:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi cập nhật trạng thái bài viết.', error: error.message },
      { status: 500 }
    );
  }
}