import { useEffect, useState } from "react";

interface UseDataFetchOptions<T> {
  /**
   * Optional filter function to find a single item
   * Useful for detail pages where you need to find by name or ID
   */
  filter?: (data: T[]) => T[];

  /**
   * Optional mapper function to transform raw data
   */
  mapper?: (rawData: any[]) => T[];

  /**
   * Enable caching to avoid refetches
   */
  cache?: boolean;
}

interface UseDataFetchArrayResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
}

interface UseDataFetchSingleResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Simple in-memory cache
const fetchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Generic hook for fetching data from JSON files
 *
 * @template T - The data type being fetched
 * @param url - The URL or path to fetch from
 * @param options - Configuration options
 * @returns Object containing data, loading state, and error
 *
 * @example
 * // Fetch array of monsters
 * const { data: monsters, loading, error } = useDataFetch<Monster>(
 *   "/data/monster.json"
 * );
 *
 * @example
 * // Fetch single monster by name
 * const { data: monster, loading } = useDataFetch<Monster>(
 *   "/data/monster.json",
 *   {
 *     filter: (monsters) => monsters.find(m => m.name === "Rathalos"),
 *     cache: true
 *   }
 * );
 */
export function useDataFetchArray<T>(
  url: string,
  options: UseDataFetchOptions<T> = {}
): UseDataFetchArrayResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { filter, mapper, cache = true } = options;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Test loading spiels
        // await sleep(5000);

        // cache
        if (cache) {
          const cached = fetchCache.get(url);
          if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            let result = cached.data as T[];

            if (filter) {
              result = filter(result);
            }

            setData(result);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch from ${url}`);
        }

        let rawData: T[] = await response.json();

        if (mapper) {
          rawData = mapper(rawData);
        }

        if (cache) {
          fetchCache.set(url, { data: rawData, timestamp: Date.now() });
        }

        if (filter) {
          rawData = filter(rawData);
        }

        setData(rawData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, filter, mapper, cache]);

  return { data, loading, error };
}

/**
 * Clear the fetch cache for a specific URL or all URLs
 * @param url - Optional URL to clear. If not provided, clears entire cache
 */
// export function clearFetchCache(url?: string): void {
//   if (url) {
//     fetchCache.delete(url);
//   } else {
//     fetchCache.clear();
//   }
// }

/**
 * Hook variant for fetching a single item by identifier
 * Useful for detail pages
 */
export function useSingleDataFetch<T extends { name?: string; id?: string }>(
  url: string,
  identifier?: string,
  options: Omit<UseDataFetchOptions<T>, "filter"> = {}
): UseDataFetchSingleResult<T> {
  const { data, loading, error } = useDataFetchArray<T>(url, options);

  const singleItem =
    data?.find(
      (item) =>
        item.name?.toLowerCase() === identifier?.toLowerCase() ||
        item.id?.toLowerCase() === identifier?.toLowerCase()
    ) || null;

  return { data: singleItem, loading, error };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
