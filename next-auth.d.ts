import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    role?: "teacher" | "student" | null;
    backendUser?: {
      id: string;
      email: string;
      name?: string | null;
      picture?: string | null;
    };
    user: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    role?: "teacher" | "student" | null;
    backendUser?: {
      id: string;
      email: string;
      name?: string | null;
      picture?: string | null;
    };
  }
}
