import { NextResponse } from 'next/server';

// Cho phép frontend tĩnh (file:// hoặc cổng khác) gọi API mock
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Dữ liệu mô phỏng bảng Users trong Database
const databaseMock = {
    users: [
        { id: 1, email: "hoanganh@example.com", name: "Trần Văn Hoàng Anh", is_active: true }
    ]
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, name, handle, bio } = body;

        // Kiểm tra xem email đã tồn tại trong DB chưa
        let user = databaseMock.users.find(u => u.email === email);
        
        if (!user) {
            // Nếu chưa có, tạo mới user (sau luồng onboarding)
            user = {
                id: databaseMock.users.length + 1,
                email: email || "user@example.com",
                name: name || "Trần Văn Hoàng Anh",
                handle: handle || "",
                bio: bio || "",
                is_active: true
            };
            databaseMock.users.push(user);
        }

        return NextResponse.json({
            success: true,
            message: "Xác thực và lưu thông tin người dùng thành công",
            token: "nextjs-mock-jwt-token-999",
            user: user
        }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi xử lý dữ liệu từ client" }, { status: 500, headers: corsHeaders });
    }
}