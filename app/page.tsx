import { connection } from "next/server";
import { AuthLanding } from "@/features/auth/auth-landing";
import { getVillages } from "@/lib/api/villages.service";

export default async function Home() {
  await connection();

  const villages = await getVillages();

  return <AuthLanding villages={villages} />;
}
