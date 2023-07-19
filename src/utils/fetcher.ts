export const fetcher = async (url: string, params?: Record<string, string>) => {
  if (!import.meta.env.VITE_GOOGLE_MAP_API) {
    throw new Error("No API key");
  }
  const searchParams = new URLSearchParams(params);
  searchParams.set("key", import.meta.env.VITE_GOOGLE_MAP_API);
  const res = await fetch(url + "?" + searchParams.toString());
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  const data = await res.json();
  if (data.status !== "OK") {
    throw new Error("No results found");
  }
  return data;
};
