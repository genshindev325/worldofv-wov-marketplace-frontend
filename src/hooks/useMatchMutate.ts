import { useSWRConfig } from "swr";

/**
 * Invalidate the contents of all cache entries that include the provided urls.
 *
 * Using global mutate is tricky with useSWRInfinite because of different urls
 * for each page, so we need to get matching urls from the cache.
 *
 * See https://github.com/vercel/swr/issues/1156
 *
 */
export default function useMatchMutate(...urls: string[]) {
    const { cache, mutate } = useSWRConfig();

    if (!(cache instanceof Map)) {
        throw new Error(
            "useMatchMutate requires the cache provider to be a Map instance."
        );
    }

    return async () => {
        const mutations = Array.from<string>(cache.keys())
            .filter((k) => urls.some((e) => k.includes(e)))
            .map((k) => mutate(k, undefined));

        await Promise.all(mutations);
    };
}
