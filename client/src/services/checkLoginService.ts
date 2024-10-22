/* eslint-disable no-undef */
import server from "./api/server";

export const checkLoginService = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  // Executing sign in route
  const response = await server.get("/auth/check", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status !== 200) {
    throw new Error("Unauthorized");
  }

  return true;
};
