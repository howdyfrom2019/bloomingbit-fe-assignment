import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "database.db");
const db = new Database(dbPath, { readonly: true });

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 50;
    const offset = (page - 1) * size;

    const totalCountResult = db
      .prepare("SELECT COUNT(*) as count FROM users")
      .get() as { count: number } | undefined;
    const totalCount = totalCountResult?.count || 0;
    const users = db
      .prepare(`SELECT * FROM users LIMIT ? OFFSET ?`)
      .all(size, offset) as User.Item[];

    return NextResponse.json({
      count: totalCount,
      page: page,
      list: users,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
