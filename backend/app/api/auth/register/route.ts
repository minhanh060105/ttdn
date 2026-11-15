import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, handle, bio, avatar_url } = body;

    if (!email || !handle || !name) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin bắt buộc (Email, Tên, Handle).' },
        { status: 400 }
      );
    }

    const cleanHandle = handle.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Kiểm tra trùng handle
    const existingHandle = await prisma.users.findUnique({
      where: { handle: cleanHandle }
    });

    if (existingHandle) {
      return NextResponse.json(
        { success: false, message: 'Handle này đã có người sử dụng. Hãy chọn handle khác.' },
        { status: 409 }
      );
    }

    // 2. Tạo bản ghi mới trong bảng users của MySQL
    const newUser = await prisma.users.create({
      data: {
        email: cleanEmail,
        handle: cleanHandle,
        display_name: name.trim(),
        bio: bio?.trim() || '',
        avatar_url: avatar_url || null,
        password_hash: 'default_dev_hash', // Mật khẩu tạm cho giai đoạn dev
        role_id: 3, // Role mặc định: user/độc giả
        preferred_language: 'vi',
        email_verified_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      user: newUser
    }, { status: 201 });

  } catch (error: any) {
    console.error('Lỗi đăng ký user:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi lưu thông tin vào cơ sở dữ liệu.', error: error.message },
      { status: 500 }
    );
  }
}