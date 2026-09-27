import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL が設定されていません");
  }

  return neon(process.env.DATABASE_URL);
}

async function prepareTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS improvement_themes (
      id SERIAL PRIMARY KEY,
      theme TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      memo TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function GET() {
  try {
    const sql = getDatabase();
    await prepareTable(sql);

    const records = await sql`
      SELECT
        id,
        theme,
        category,
        status,
        memo,
        created_at
      FROM improvement_themes
      ORDER BY created_at DESC
    `;

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /api/themes:", error);

    return NextResponse.json(
      { error: "保存データを読み込めませんでした" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const sql = getDatabase();
    await prepareTable(sql);

    const body = await request.json();

    const theme = String(body.theme ?? "").trim();
    const category = String(body.category ?? "生産性");
    const status = String(body.status ?? "未確認");
    const memo = String(body.memo ?? "").trim();

    if (!theme) {
      return NextResponse.json(
        { error: "改善テーマを入力してください" },
        { status: 400 }
      );
    }

    const saved = await sql`
      INSERT INTO improvement_themes (
        theme,
        category,
        status,
        memo
      )
      VALUES (
        ${theme},
        ${category},
        ${status},
        ${memo}
      )
      RETURNING
        id,
        theme,
        category,
        status,
        memo,
        created_at
    `;

    return NextResponse.json(saved[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/themes:", error);

    return NextResponse.json(
      { error: "改善テーマを保存できませんでした" },
      { status: 500 }
    );
  }
}
