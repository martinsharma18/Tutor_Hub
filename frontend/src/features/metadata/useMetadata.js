import { useQuery } from "@tanstack/react-query";
import { metadataApi } from "./api";

/**
 * Dropdown options, fetched once and reused app-wide. This data changes only when an admin edits
 * it (and the server caches it too), so a long staleTime here avoids refetching on every mount.
 */
export const useMetadata = () =>
  useQuery({
    queryKey: ["metadata"],
    queryFn: metadataApi.all,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

/** Options for one category (e.g. "Gender"), or [] while loading / if the category is empty. */
export const useLookup = (category) => {
  const { data, isLoading } = useMetadata();
  return { options: data?.[category] ?? [], isLoading };
};
