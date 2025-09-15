interface DBUser {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  createdAt: string;
}

interface DBUserInsert {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

declare namespace DB {
  type User = DBUser;
  type Insert = DBUserInsert;
}
