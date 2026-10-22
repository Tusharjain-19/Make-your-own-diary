import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory / database store for user fonts
const USER_FONTS_DB: Record<string, Array<{ id: string; name: string; glyphCount: number; createdAt: string }>> = {
  "user-tushar-01": [
    {
      id: "font-seed-01",
      name: "Tushar Royal Pen",
      glyphCount: 76,
      createdAt: new Date().toISOString(),
    },
  ],
  "user-nandini-02": [
    {
      id: "font-seed-02",
      name: "Nandini Script",
      glyphCount: 76,
      createdAt: new Date().toISOString(),
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, glyphCount, userId = "user-tushar-01" } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Font name is required" }, { status: 400 });
    }

    if (!glyphCount || glyphCount < 5) {
      return NextResponse.json(
        { success: false, error: "At least 5 glyphs must be processed to compile font" },
        { status: 400 }
      );
    }

    // Enforce max 3 fonts per user constraint
    const userFonts = USER_FONTS_DB[userId] || [];
    if (userFonts.length >= 3 && !userFonts.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 3 handwriting fonts allowed per account. Delete an existing font to add a new one.",
        },
        { status: 403 }
      );
    }

    const newFont = {
      id: `hw-${Date.now()}`,
      name: name.trim(),
      glyphCount,
      createdAt: new Date().toISOString(),
      status: "ready",
    };

    // Replace if same name, otherwise prepend
    const filtered = userFonts.filter((f) => f.name.toLowerCase() !== name.toLowerCase());
    USER_FONTS_DB[userId] = [newFont, ...filtered];

    return NextResponse.json({
      success: true,
      font: newFont,
      message: `Font "${name}" saved successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Handwriting font save failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user-tushar-01";
  const fonts = USER_FONTS_DB[userId] || [];

  return NextResponse.json({
    success: true,
    fonts,
  });
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const userId = searchParams.get("userId") || "user-tushar-01";

    if (!name) {
      return NextResponse.json({ success: false, error: "Font name required" }, { status: 400 });
    }

    if (USER_FONTS_DB[userId]) {
      USER_FONTS_DB[userId] = USER_FONTS_DB[userId].filter((f) => f.name !== name);
    }

    return NextResponse.json({ success: true, message: `Font "${name}" removed` });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}
