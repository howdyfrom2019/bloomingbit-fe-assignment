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

interface UserPayload {
  size: number;
  page: number;
}

interface UserResponse {
  count: number;
  page: number;
  list: User.Item[];
}

declare namespace User {
  type Item = DBUser;
  type Insert = DBUserInsert;

  type Payload = UserPayload;
  type Response = UserResponse;
}
