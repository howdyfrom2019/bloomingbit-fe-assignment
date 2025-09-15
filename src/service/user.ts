import api from "@/service/client";
import { queryOptions } from "@tanstack/react-query";

export async function fetchUsers(payload: User.Payload) {
  try {
    const response = await api.get<User.Response>("/api/users", {
      params: payload,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export function userOptions(payload: User.Payload) {
  return queryOptions({
    queryKey: ["users", payload],
    queryFn: () => fetchUsers(payload),
    staleTime: 5 * 1000,
  });
}
