import { useEffect, useState } from "react";

interface UseDataFetchOptions<T> {
  /**
   * Optional filter function to find a single item
   * Useful for detail pages where you need to find by name or ID
   */
  filter?: (data: T[]) => T | null | undefined;
  
  /**
   * Optional mapper function to transform raw data
   */
  mapper?: (rawData: any[]) => T[];
  
  /**
   * Enable caching to avoid refetches
   */
  cache?: boolean;
}

interface UseDataFetchResult<T> {
  data: T | T[] | null;
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
export function useDataFetch<T>(
  url: string,
  options: UseDataFetchOptions<T> = {}
): UseDataFetchResult<T> {
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { filter, mapper, cache = true } = options;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        if (cache) {
          const cached = fetchCache.get(url);
          if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            let result: T | T[] | null = cached.data;
            if (filter) {
              result = filter(Array.isArray(cached.data) ? cached.data : [cached.data]);
            }
            setData(result);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
        }

        let rawData = await response.json();

        // Apply mapper if provided
        if (mapper) {
          rawData = mapper(rawData);
        }

        // Cache the data
        if (cache) {
          fetchCache.set(url, { data: rawData, timestamp: Date.now() });
        }

        // Apply filter if provided
        let result: T | T[] | null = rawData;
        if (filter) {
          result = filter(Array.isArray(rawData) ? rawData : [rawData]);
        }

        setData(result);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setData(null);
        console.error(`Error fetching from ${url}:`, error);
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
export function clearFetchCache(url?: string): void {
  if (url) {
    fetchCache.delete(url);
  } else {
    fetchCache.clear();
  }
}

/**
 * Hook variant for fetching a single item by identifier
 * Useful for detail pages
 */
export function useSingleDataFetch<T extends { name?: string; id?: string }>(
  url: string,
  identifier: string | undefined,
  options: Omit<UseDataFetchOptions<T>, "filter"> = {}
): UseDataFetchResult<T> {
  return useDataFetch<T>(
    url,
    {
      ...options,
      filter: (data: T[]) => {
        if (!identifier) return null;
        return (
          data.find((item) => item.name?.toLowerCase() === identifier.toLowerCase()) ||
          data.find((item) => item.id?.toLowerCase() === identifier.toLowerCase()) ||
          null
        );
      },
    }
  );
}
