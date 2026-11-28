import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not set in .env");
}

// Shob environment e (dev + production) ek-i client reuse hobe
const g = globalThis as unknown as { mongoClient?: MongoClient };

if (!g.mongoClient) {
  g.mongoClient = new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });
}

const client = g.mongoClient;

export const database = client.db("Mentor-lagbe");

export const auth = betterAuth({
  // client pass kora hocche jate adapter er sathe same client use hoy
  database: mongodbAdapter(database, { client }),
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
        input: true,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      phone: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, role: user.role === "tutor" ? "tutor" : "student" },
        }),
      },
      update: {
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