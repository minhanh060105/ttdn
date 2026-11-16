import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Tìm user trong bảng users của MySQL kèm theo roles
    const user = await prisma.users.findUnique({
      where: { email: cleanEmail },
      include: { roles: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'The email or password is incorrect, or the account is locked.' },
        { status: 401 }
      );
    }

    // 2. Kiểm tra tài khoản có bị khóa không
    if (!user.is_active) {
      return NextResponse.json(
        { 
          success: false, 
          message: user.ban_reason || 'The account is locked.' 
        },
        { status: 403 }
      );
    }

    // 3. So khớp mật khẩu: Hỗ trợ cả bcrypt chuẩn, chuỗi hash demo, và plain-text
    let isMatch = false;

    if (user.password_hash === '$2a$10$demo_hash_password_placeholder') {
      // Hỗ trợ trực tiếp cho tài khoản hiện tại trong DB
      isMatch = (password === '12345678' || password === 'demo' || password === 'password123');
    } else if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      isMatch = (user.password_hash === password);
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'The email or password is incorrect, or the account is locked.' },
        { status: 401 }
      );
    }

    // 4. Trả về thông tin đăng nhập thành công
    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: Number(user.id),
        email: user.email,
        handle: user.handle,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        role: user.roles?.code || 'user'
      }
    });

  } catch (error: any) {
    console.error('Lỗi API login:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi đăng nhập.', error: error.message },
      { status: 500 }
    );
  }
}