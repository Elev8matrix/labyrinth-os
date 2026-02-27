import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    /*
     * Protect everything except:
     * - /login
     * - /api/auth (NextAuth endpoints)
     * - /api/seed (seeding endpoint)
     * - _next/static, _next/image, favicon
     */
    "/((?!login|api/auth|api/seed|_next/static|_next/image|favicon.ico).*)",
  ],
};
