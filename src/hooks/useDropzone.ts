import { useMemo, useState } from "react";

interface Token {
    file: File;
    // name: string | null;
}

export function useDropzone() {
    const [tokens, setTokens] = useState<Token[]>([]);

    const insertTokens = (values: Token[]) => {
        const items = values.map(({ file /*, name, ...rest */ }) => ({
            file,
            // name: name ?? null,
            // TODO: add mapper for the remaining fields
            // ...rest,
        }));

        const sorted = items
            .concat(tokens)
            .sort((a, b) => a.file.name.localeCompare(b.file.name));

        setTokens(sorted);
    };

    const removeToken = (index: number) => {
        setTokens([...tokens.slice(0, index), ...tokens.slice(index + 1)]);
    };

    const files = useMemo(() => tokens.map((t) => t.file), [tokens]);

    const handleDrop = (files: File[]) => {
        insertTokens(files.map((file) => ({ file })));
    };

    const handleRemove = (file: File) => {
        removeToken(tokens.findIndex((t) => t.file.name === file.name));
    };

    const handleClear = () => {
        setTokens([]);
    };

    return {
        files,
        handleDrop,
        handleRemove,
        handleClear,
    };
}
