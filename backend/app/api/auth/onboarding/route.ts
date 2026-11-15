import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ email không hợp lệ.' },
        { status: 400 }
      );
    }

    // 1. Kiểm tra trong MySQL xem email đã có tài khoản chưa
    const existingUser = await prisma.users.findFirst({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          isExisting: true,
          message: 'Email này đã được sử dụng. Vui lòng đăng nhập.'
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email hợp lệ. Chuyển sang bước tạo thông tin hồ sơ.',
      email: email.trim().toLowerCase()
    });
  } catch (error: any) {
    console.error('Lỗi xác thực onboarding email:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ kết nối cơ sở dữ liệu.' },
      { status: 500 }
    );
  }
}