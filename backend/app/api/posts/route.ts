import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      content_html,
      cover_image,
      language_id,
      category_id,
      tag_ids,
      status,
      author_id,
      publication_id
    } = body;

    if (!title || !content_html) {
      return NextResponse.json(
        { success: false, message: 'Tiêu đề và nội dung bài viết không được để trống.' },
        { status: 400 }
      );
    }

    if (!author_id) {
      return NextResponse.json(
        { success: false, message: 'Không xác định được tác giả đăng nhập.' },
        { status: 401 }
      );
    }

    const postStatus = ['published', 'pending', 'draft'].includes(status) ? status : 'draft';
    const langId = language_id ? Number(language_id) : 1;
    const catId = category_id ? Number(category_id) : null;
    const pubId = publication_id ? BigInt(publication_id) : BigInt(1);

    // 1. CẬP NHẬT BÀI VIẾT (Update)
    if (id) {
      const existingPost = await prisma.posts.findUnique({
        where: { id: BigInt(id) }
      });

      if (!existingPost) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy bài viết để sửa.' }, { status: 404 });
      }

      const updatedPost = await prisma.posts.update({
        where: { id: BigInt(id) },
        data: {
          title: title.trim(),
          slug: slug.trim(),
          content: content_html,
          thumbnail_url: cover_image || null,
          status: postStatus,
          published_at: postStatus === 'published' ? new Date() : existingPost.published_at,
          languages: {
            connect: { id: langId }
          },
          ...(catId ? { categories: { connect: { id: catId } } } : { categories: { disconnect: true } })
        }
      });

      if (Array.isArray(tag_ids)) {
        await prisma.post_tags.deleteMany({ where: { post_id: BigInt(id) } });
        if (tag_ids.length > 0) {
          await prisma.post_tags.createMany({
            data: tag_ids.map((tagId: number | string) => ({
              post_id: BigInt(id),
              tag_id: Number(tagId)
            }))
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: postStatus === 'pending' ? 'Gửi duyệt bài viết thành công!' : 'Đã cập nhật bản nháp!',
        post_id: Number(updatedPost.id)
      });
    }

    // 2. TẠO MỚI BÀI VIẾT (Create)
    const newPost = await prisma.posts.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content: content_html,
        thumbnail_url: cover_image || null,
        status: postStatus,
        published_at: postStatus === 'published' ? new Date() : null,
        
        // Liên kết Tác giả
        users_posts_author_idTousers: {
          connect: {
            id: BigInt(author_id)
          }
        },

        // Liên kết Publication
        publications: {
          connect: {
            id: pubId
          }
        },

        // Liên kết Ngôn ngữ (bắt buộc)
        languages: {
          connect: {
            id: langId
          }
        },

        // Liên kết Danh mục (nếu có chọn)
        ...(catId ? {
          categories: {
            connect: {
              id: catId
            }
          }
        } : {})
      }
    });

    // Lưu các thẻ tags kèm theo
    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      await prisma.post_tags.createMany({
        data: tag_ids.map((tagId: number | string) => ({
          post_id: newPost.id,
          tag_id: Number(tagId)
        }))
      });
    }

    return NextResponse.json({
      success: true,
      message: postStatus === 'pending' ? 'Gửi duyệt bài viết thành công!' : 'Đã lưu bản nháp vào MySQL!',
      post_id: Number(newPost.id)
    }, { status: 201 });

  } catch (error: any) {
    console.error('Lỗi lưu bài viết MySQL:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi lưu bài viết.', error: error.message },
      { status: 500 }
    );
  }
}