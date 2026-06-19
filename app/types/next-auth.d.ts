import "next-auth";

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    googleAccessToken?: string;
    role?: string;
    backendUser?: unknown;
  }
}