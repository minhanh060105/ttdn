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

    const cleanEmail = email.trim().toLowerCase();
    const cleanHandle = handle.trim().toLowerCase();

    // 1. Kiểm tra xem email hoặc handle đã tồn tại chưa
    const existing = await prisma.users.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { handle: cleanHandle }]
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc Handle đã tồn tại trong hệ thống.' },
        { status: 409 }
      );
    }

    // 2. Chèn bản ghi mới (đã loại bỏ preferred_language)
    const newUser = await prisma.users.create({
      data: {
        email: cleanEmail,
        handle: cleanHandle,
        display_name: name.trim(),
        password_hash: '$2a$10$demo_hash_password_placeholder',
        bio: bio?.trim() || null,
        avatar_url: avatar_url || null,
        roles: {
          connect: {
            id: 3
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Tạo tài khoản thành công vào MySQL!',
      data: newUser
    }, { status: 201 });

  } catch (error: any) {
    console.error('Lỗi khi lưu user vào MySQL:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi lưu vào cơ sở dữ liệu.', error: error.message },
      { status: 500 }
    );
  }
}