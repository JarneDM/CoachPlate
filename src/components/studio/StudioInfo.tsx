"use client";

import React, { useEffect, useState } from "react";
import { getStudioInfo } from "@services/studio/getStudioInfo";

type Studio = {
  name?: string | null;
  members?: number | null;
};

function StudioInfo() {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudio = async () => {
      try {
        const { data } = await getStudioInfo();

        if (!isMounted) {
          return;
        }

        setStudio(data ?? null);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Unable to load studio info.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStudio();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Loading studio info...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>{studio?.name ?? "Untitled studio"}</h1>
      <p>{studio?.members ?? 0}/5</p>
    </div>
  );
}

export default StudioInfo;
