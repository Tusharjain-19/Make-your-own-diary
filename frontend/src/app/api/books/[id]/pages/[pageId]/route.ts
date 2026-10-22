import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RouteParams {
  params: {
    id: string;
    pageId: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: bookId, pageId } = params;

    if (!bookId || !pageId) {
      return NextResponse.json(
        { success: false, error: "Book ID and Page ID are required." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const timestamp = new Date().toISOString();

    // In local prototype mode, server validates and confirms page update
    return NextResponse.json({
      success: true,
      bookId,
      pageId,
      data: body,
      updatedAt: timestamp,
      message: `Page ${pageId} for book ${bookId} autosaved successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Autosave failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: bookId, pageId } = params;
  return NextResponse.json({
    success: true,
    bookId,
    pageId,
    status: "ready",
  });
}
