import {
  activities,
  activityCategories,
  getActivitiesByVillage,
  getActivityById as getMockActivityById,
} from "@/data/activities";

export function getActivities() {
  return activities;
}

export function getActivityById(id: string) {
  return getMockActivityById(id);
}

export function getActivitiesByVillageId(villageId: string) {
  return getActivitiesByVillage(villageId);
}

export function getActivityCategories() {
  return activityCategories;
}
