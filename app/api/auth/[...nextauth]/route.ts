import NextAuth from "next-auth";
import { config } from "@/auth"; // pastikan ini benar

const handler = NextAuth(config);

export { handler as GET, handler as POST };
