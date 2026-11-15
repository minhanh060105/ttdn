import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Thử truy vấn danh sách users hoặc roles từ database
    const users = await prisma.users.findMany({
      take: 10,
    });

    return NextResponse.json({
      success: true,
      message: 'Kết nối MySQL thành công!',
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi kết nối cơ sở dữ liệu',
        error: error.message,
      },
      { status: 500 }
    );
  }
}