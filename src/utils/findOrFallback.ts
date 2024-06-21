export function findOrFallback<T>(
    options: T[],
    matcher: (opt: T) => boolean
): T {
    return options.find(matcher) || options[0];
}
