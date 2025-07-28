import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";
import { generateToken } from "./jwt";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: "premiere-stays" }),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          role: "user",
        };
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: undefined,
          role: "user",
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection("users").findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.fullName,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook" || account?.provider === "apple") {
        try {
          const client = await clientPromise;
          const db = client.db("premiere-stays");
          const registerType = account.provider; // "google", "facebook", "apple"

          // Check if user already exists
          const existingUser = await db.collection("users").findOne({
            email: user.email?.toLowerCase()
          });

          if (!existingUser) {
            // Create new user
            const newUser = {
              fullName: user.name || "",
              email: user.email?.toLowerCase() || "",
              phone: "",
              dob: "",
              password: "", // No password for social login
              profileImage: user.image || "",
              role: "user",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastLogin: new Date(),
              registerType, // <-- set registerType
              socialLogin: {
                provider: account.provider,
                providerId: user.id,
              },
            };

            await db.collection("users").insertOne(newUser);
          } else {
            // Update existing user's social login info and registerType if missing
            await db.collection("users").updateOne(
              { email: user.email?.toLowerCase() },
              {
                $set: {
                  lastLogin: new Date(),
                  updatedAt: new Date(),
                  socialLogin: {
                    provider: account.provider,
                    providerId: user.id,
                  },
                  registerType: existingUser.registerType || registerType, // don't overwrite if already set
                },
              }
            );
          }
        } catch (error) {
          console.error("Social sign in error:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
}; 