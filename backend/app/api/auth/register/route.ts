import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email, password, name, handle, bio, avatar_url } = body;

    // Nếu không có mật khẩu gửi từ client, gán mật khẩu mặc định
    if (!password) {
      password = 'password123';
    }

    if (!email || !handle || !name) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin bắt buộc (Email, Tên, Handle).' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanHandle = handle.trim().toLowerCase();

    // 1. Kiểm tra tài khoản đã tồn tại chưa
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

    // 2. Hash mật khẩu thực tế
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Tạo tài khoản trong bảng users
    const newUser = await prisma.users.create({
      data: {
        email: cleanEmail,
        handle: cleanHandle,
        display_name: name.trim(),
        password_hash: passwordHash,
        bio: bio?.trim() || null,
        avatar_url: avatar_url || null,
        is_active: true,
        roles: {
          connect: {
            id: 3 // Đảm bảo bảng roles có id = 3
          }
        }
      }
    });

    // 4. Khởi tạo Publication cá nhân
    try {
      await prisma.publications.create({
        data: {
          name: `Bản tin của ${name.trim()}`,
          slug: `${cleanHandle}-newsletter-${Date.now().toString().slice(-4)}`,
          description: `Bản tin cá nhân của tác giả ${name.trim()}`,
          users: {
            connect: {
              id: newUser.id
            }
          }
        }
      });
    } catch (pubErr) {
      console.warn('Không thể tạo publication mặc định:', pubErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công vào MySQL!',
      user: {
        id: Number(newUser.id),
        email: newUser.email,
        handle: newUser.handle,
        display_name: newUser.display_name
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Lỗi khi lưu user vào MySQL:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi lưu tài khoản.', error: error.message },
      { status: 500 }
    );
  }
}