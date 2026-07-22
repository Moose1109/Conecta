export const COMMUNITY_DATA_REFRESH_EVENT = "conecta-community-data-refresh";

export function requestCommunityDataRefresh() {
  window.dispatchEvent(new Event(COMMUNITY_DATA_REFRESH_EVENT));
}
