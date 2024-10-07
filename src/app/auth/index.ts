import NextAuth, { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";

export const BaseURL = "/api/auth";

const authProvider: NextAuthConfig = {
  providers: [
    credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        const res = await fetch(`${process.env.SITE_URL}/api/user`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        console.log("user ", user, res);
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  basePath: BaseURL,
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authProvider);
