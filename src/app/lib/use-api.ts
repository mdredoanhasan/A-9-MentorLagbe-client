"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api<T>(endpoint)
      .then(setData)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(load, [load]);

  return { data, loading, error, reload: load };
}