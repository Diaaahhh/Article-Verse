import {API_BASE_URL} from "../constants/api" 
export async function getSettings() {
  const res = await fetch(
    `${API_BASE_URL}/api/settings`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}