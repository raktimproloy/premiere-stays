import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Log the token and user data for debugging
            console.log("JWT Callback - Token:", token);
            console.log("JWT Callback - User:", user);
            console.log("JWT Callback - Account:", account);
            
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    },
                };
            }
            return token;
        },
        async session({ session, token }) {
            // Log session data for debugging
            console.log("Session Callback - Session:", session);
            console.log("Session Callback - Token:", token);
            
            session.user = token.user as any;
            (session as any).accessToken = token.accessToken;
            return session;
        },
        async signIn({ user, account, profile }) {
            // Log sign-in data for debugging
            console.log("SignIn Callback - User:", user);
            console.log("SignIn Callback - Account:", account);
            console.log("SignIn Callback - Profile:", profile);
            
            return true;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
