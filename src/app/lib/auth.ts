import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not set in .env");
}

// Dev-e hot reload hole bar bar notun connection na khule
const g = globalThis as unknown as { mongoClient?: MongoClient };
const client = g.mongoClient ?? new MongoClient(mongoUri);
if (process.env.NODE_ENV !== "production") g.mongoClient = client;

export const database = client.db("Mentor-lagbe");

export const auth = betterAuth({
  database: mongodbAdapter(database),
  baseURL: process.env.BETTER_AUTH_URL,
  // Local ar Vercel preview URL-eo login kaj korar jonno
  trustedOrigins: ["http://localhost:3000", "https://*.vercel.app"],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true, // sign-up form role pathate pare
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false, // user nijer plan change korte parbe na
      },
      phone: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Sign up-e shudhu student ba tutor, onno kichu hole student
        before: async (user) => ({
          data: { ...user, role: user.role === "tutor" ? "tutor" : "student" },
        }),
      },
      update: {
        // Profile update diye role ba plan bodlano jabe na
        before: async (data) => {
          if ("role" in data || "plan" in data) {
            throw new APIError("BAD_REQUEST", {
              message: "Role and plan cannot be changed here",
            });
          }
          return { data };
        },
      },
    },
  },
});