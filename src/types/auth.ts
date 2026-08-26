export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  data: User;
};
