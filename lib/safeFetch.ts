// lib/safeFetch.ts
export async function safeFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    // Cloning response to read body safely in multiple ways
    const resClone = res.clone();

    let data: any = null;

    try {
      data = await res.json();
    } catch {
      try {
        data = await resClone.text();
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      const errorMessage =
        (data && (data.error || data.message)) ||
        `Request failed: ${res.status} ${res.statusText}`;
      console.error(`❌ Fetch error [${url}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    console.error(`🔥 Network or unknown error for ${url}:`, error.message);
    throw new Error(
      error.message || "Unable to fetch data. Please check your connection."
    );
  }
}
