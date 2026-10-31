import { API_BASE } from "./api";

export async function trackPageView(pagePath = window.location.pathname) {
  try {
    const response = await fetch(`${API_BASE}/analytics/page-view`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_path: pagePath,
      }),
    });

    if (!response.ok) {
      console.error("Analytics tracking failed:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Analytics connection error:", error);
    return false;
  }
}
