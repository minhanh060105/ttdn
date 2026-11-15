import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Tìm user trong MySQL
    const user = await prisma.users.findFirst({
      where: { email: cleanEmail },
      include: { roles: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email này chưa được đăng ký trong hệ thống.' },
        { status: 401 }
      );
    }

    // 2. So khớp mật khẩu thực tế
    let isMatch = false;
    if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      isMatch = user.password_hash === password;
    }

    // NẾU SAI MẬT KHẨU: Chặn ngay lập tức
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: Number(user.id),
        email: user.email,
        handle: user.handle,
        display_name: user.display_name,
        role: user.roles?.code || 'user'
      }
    });

  } catch (error: any) {
    console.error('Lỗi login API:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi đăng nhập', error: error.message },
      { status: 500 }
    );
  }
}