import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "db";
import { compareSync } from "bcryptjs";
import { User } from "@prisma/client";
import { findUser } from "db/queries";
import { USER_SELECT } from "db/selects";

const credentialsError = "Login or email are incorrect";

export const ownerAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const user = await findUser(
          { email: credentials.email },
          {
            ...USER_SELECT,
            password: true,
            hotel: {
              select: {
                id: true,
                name: true,
                email: true,
                guestsAmount: true,

                deleted: true,
                suspended: true,
                settings: true
              },
            },
          }
        );

        if (!user?.password) {
          throw new Error(credentialsError);
        }

        if (
          user.position === "OWNER" &&
          !compareSync(credentials.password, user.password)
        ) {
          throw new Error(credentialsError);
        }

        const { password, ...data } = user;

        return data;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30000,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      user && (token.user = user);
      return token;
    },

    session: ({ session, token }) => {
      return {
        ...session,
        user: (token.user as any) || token,
      };
    },

    signIn: ({ user }) => {
      // @ts-ignore
      return !user.suspended && !user.deleted && !user.hotel.suspended;
    },
  },
};

export const adminAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error(credentialsError);
        }

        const { password, ...rest } = user;

        if (
          user.position !== "ADMIN" ||
          (password && !compareSync(credentials.password, password))
        ) {
          throw new Error(credentialsError);
        }

        return rest as any;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 3000,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      user && (token.user = user);
      return token;
    },

    session: ({ session, token }) => {
      return {
        ...session,
        user: token.user as any,
      };
    },

    signIn: ({ user }) => {
      // @ts-ignore
      return !user.suspended;
    },
  },
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Omit<User, "password">;
  }
}
