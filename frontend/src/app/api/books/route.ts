import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title = "Untitled Book",
      subtitle = "",
      author = "Author",
      dates = "",
      bookType = "Travel Diary",
      size = "A5",
      themeId = "warm-editorial",
      userId = "user-default",
    } = body;

    const bookId = `book-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const book = {
      id: bookId,
      userId,
      title: title.trim() || "Untitled Book",
      subtitle: subtitle.trim(),
      author: author.trim(),
      dates: dates.trim(),
      bookType,
      size,
      themeId,
      status: "draft",
      pageCount: 20,
      createdAt: timestamp,
      updatedAt: timestamp,
      coverFront: {
        title,
        subtitle,
        author,
        dates,
        themeId,
      },
    };

    // Auto-create 20 pages with layouts and mm coordinate structure
    const pages = Array.from({ length: 20 }, (_, index) => ({
      id: `page-${bookId}-${index + 1}`,
      bookId,
      position: index + 1,
      data: {
        bg: "#FAFAF8",
        layoutId: index === 0 ? "L07" : index === 1 ? "L01" : index === 2 ? "L02" : "L03",
        elements: [],
      },
      updatedAt: timestamp,
    }));

    return NextResponse.json({
      success: true,
      book,
      pages,
      message: "Book and 20 pages initialized successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create book" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "storybound-books-api",
    timestamp: new Date().toISOString(),
  });
}
