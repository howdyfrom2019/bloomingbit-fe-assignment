"server-only";

import Database from "better-sqlite3";
import { faker } from "@faker-js/faker";
import path from "path";

const dbPath = path.resolve(process.cwd(), "database.db");
const db = new Database(dbPath);
console.log(`[Database] Connected to ${dbPath}`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    address TEXT,
    phone TEXT
  );
`);

export const generateUsers = (count: number = 10_000) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      phone: faker.phone.number(),
      createdAt: faker.date.past(),
    });
  }
  return users;
};

export const insert = db.prepare(
  `INSERT INTO users (id, name, email, address, phone) VALUES (?, ?, ?, ?, ?)`
);

export const insertMany = db.transaction((rows: DB.Insert[]) => {
  for (const row of rows) {
    insert.run(row.id, row.name, row.email, row.address, row.phone);
  }
});

export const seed = async () => {
  const users = generateUsers();
  insertMany(users);
  db.close();
};
