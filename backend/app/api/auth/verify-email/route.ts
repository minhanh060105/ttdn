import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp email và mã xác thực.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Trong môi trường dev/demo: mã mặc định là 123456
    if (otp !== '123456') {
      return NextResponse.json(
        { success: false, message: 'Mã xác nhận OTP không chính xác hoặc đã hết hạn.' },
        { status: 400 }
      );
    }

    // Nếu user đã tồn tại trong MySQL, kích hoạt tài khoản (is_active = true)
    const existingUser = await prisma.users.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      await prisma.users.update({
        where: { email: cleanEmail },
        data: { is_active: true }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Xác thực địa chỉ email thành công!'
    });

  } catch (error: any) {
    console.error('Lỗi xác thực email:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi xác thực.', error: error.message },
      { status: 500 }
    );
  }
}