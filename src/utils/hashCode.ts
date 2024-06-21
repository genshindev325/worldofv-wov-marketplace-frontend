/**
 * This is a simple, *insecure* hash that's short, fast, and has no dependencies.
 * See https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
export default function hashCode(input: string) {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash;
}
