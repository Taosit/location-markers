export const fetcher = async (url: string, params?: Record<string, string>) => {
  if (!import.meta.env.VITE_GOOGLE_MAP_API) {
    throw new Error("No API key");
  }
  const searchParams = new URLSearchParams(params);
  searchParams.set("key", import.meta.env.VITE_GOOGLE_MAP_API);
  const res = await fetch(url + "?" + searchParams.toString());
  const data = await res.json();
  if (data.status !== "OK" || data.results.length === 0) {
    throw new Error("No results found");
  }
  return data.results;
};
