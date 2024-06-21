import { createContext, PropsWithChildren, useState } from "react";

export interface TokenInfo {
    file: File;
    name: string | null;
    royaltyPercent: number | null;
    description: string | null;
    categories: { name: string; value: string }[] | null;
}

export interface CollectionInfo {
    id: string;
    label: string;
}

export interface BatchCreateContext {
    currentStep: number;
    setCurrentStep: (step: number) => void;
    increaseStep: () => void;
    collection: CollectionInfo | null;
    setCollection: (collection: CollectionInfo | null) => void;
    tokens: TokenInfo[];
    replaceTokens: (tokens: TokenInfo[]) => void;
    insertTokens: (tokens: Partial<TokenInfo>[]) => void;
    removeToken: (index: number) => void;
}

export const BatchCreateContext = createContext<BatchCreateContext>({
    currentStep: 0,
    setCurrentStep: () => {},
    increaseStep: () => {},
    collection: null,
    tokens: [],
    setCollection: () => {},
    replaceTokens: () => {},
    insertTokens: () => {},
    removeToken: () => {},
});

export default function BatchCreateProvider(props: PropsWithChildren<{}>) {
    const [currentStep, setCurrentStep] = useState(0);
    const [collection, setCollection] = useState<CollectionInfo | null>(null);
    const [tokens, setTokens] = useState<TokenInfo[]>([]);

    const insertTokens = (values: Partial<TokenInfo>[]) => {
        const items = values.map((v) => ({
            file: v.file!,
            name: v.name ?? null,
            royaltyPercent: v.royaltyPercent ?? null,
            description: v.description ?? null,
            categories: v.categories ?? null,
        }));

        const sorted = items
            .concat(tokens)
            .sort((a, b) => a.file.name.localeCompare(b.file.name));

        setTokens(sorted);
    };

    const removeToken = (index: number) => {
        setTokens([...tokens.slice(0, index), ...tokens.slice(index + 1)]);
    };

    const increaseStep = () => {
        setCurrentStep(currentStep + 1);
    };

    return (
        <BatchCreateContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                increaseStep,
                collection,
                setCollection,
                tokens,
                replaceTokens: setTokens,
                insertTokens,
                removeToken,
            }}
            {...props}
        />
    );
}
