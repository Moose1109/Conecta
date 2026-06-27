import { getVillageById as getMockVillageById, villages } from "@/data/villages";

export function getVillages() {
  return villages;
}

export function getVillageById(id: string) {
  return getMockVillageById(id);
}
