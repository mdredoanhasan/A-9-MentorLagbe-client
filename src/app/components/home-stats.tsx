import { connection } from "next/server";
import { HomepageStatistics } from "./subjects";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type HomepageStats = {
  tutorCount: number;
  studentCount: number;
  liveTuitions: number;
};

async function getHomepageStats(): Promise<HomepageStats | null> {
  await connection();

  try {
    const response = await fetch(`${API_BASE_URL}/api/public/stats`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Homepage stats request failed (${response.status}).`);
    }

    const stats = (await response.json()) as HomepageStats;
    if (
      !Number.isInteger(stats.tutorCount) ||
      !Number.isInteger(stats.studentCount) ||
      !Number.isInteger(stats.liveTuitions)
    ) {
      throw new Error("Homepage stats response was invalid.");
    }
    return stats;
  } catch (error) {
    console.error("Could not load homepage statistics:", error);
    return null;
  }
}

export default async function HomeStats() {
  const stats = await getHomepageStats();

  return (
    <HomepageStatistics
      tutorCount={stats?.tutorCount ?? null}
      studentCount={stats?.studentCount ?? null}
      liveTuitions={stats?.liveTuitions ?? null}
    />
  );
}
