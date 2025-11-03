// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/Dashboard/:path*", // protect dashboard and subroutes
    "/contacts/:path*",  // protect contacts page
    "/messages/:path*",  // protect messages page
    "/notes/:path*",     // protect notes page
  ],
};
// This middleware will ensure that only authenticated users can access the specified routes.