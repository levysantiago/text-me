import server from "./api/server";

interface ISignupServiceProps {
  name: string;
  email: string;
  password: string;
}

export const signupService = async ({
  name,
  email,
  password,
}: ISignupServiceProps): Promise<void> => {
  // Executing sign in route
  const response = await server.post("/user", { name, email, password });
  if (response.status !== 200) {
    throw new Error("Failed to sign in");
  }
};
