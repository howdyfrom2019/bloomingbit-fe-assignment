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

    const totalCount = db
      .prepare("SELECT COUNT(*) FROM users")
      .get("COUNT(*)") as number;
    const users = db
      .prepare(`SELECT * FROM users LIMIT ? OFFSET ?`)
      .all(size, offset) as DB.User[];

    return NextResponse.json({
      count: totalCount,
      page: Math.ceil(totalCount / size),
      list: users,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
