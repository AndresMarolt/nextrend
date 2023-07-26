import User from "@/models/User";
import nextAuth from "next-auth";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.email) token.email = user.email;
      if (user?.username) token.username = user.username;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.email) session.user.email = token.email;
      if (token?.username) session.user.username = token.username;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          const aux = {
            _id: user._id,
            username: user.username,
            email: user.email,
          };
          return aux;
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
});
