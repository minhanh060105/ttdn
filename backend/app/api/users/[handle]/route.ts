import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'followers'; // 'followers' hoặc 'following'

  // Dữ liệu mẫu trả về danh sách user
  const mockUsers = [
    { id: 11, handle: 'ryan_vu36', display_name: 'ĐỨC MIN', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { id: 12, handle: 'phamnhatly_30', display_name: 'Phạm Nhật Ly', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
    { id: 13, handle: 'n.p.t2k2', display_name: 'Nguyễn Phương Thảo', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
  ];

  return NextResponse.json({
    success: true,
    type,
    handle,
    data: mockUsers
  });
}