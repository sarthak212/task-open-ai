import { auth, BaseURL } from "@/app/auth";
import { NextResponse } from "next/server";
export const config = {
  matcher: ["/"],
};

export default auth((req) => {
  const reqUrl = new URL(req.url);

  if (!req.auth) {
    return NextResponse.redirect(
      new URL(`${BaseURL}/signin?callbackUrl=${reqUrl.pathname}`, req.url)
    );
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
});
