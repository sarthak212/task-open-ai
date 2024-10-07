import { auth, BaseURL } from "@/app/auth";
import { SessionProvider } from "next-auth/react";

export async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session && session.user) {
    session.user = {
      email: session.user.email,
      id: session.user.id,
    };
  }
  return (
    <SessionProvider baseUrl={BaseURL} session={session}>
      {children}
    </SessionProvider>
  );
}
