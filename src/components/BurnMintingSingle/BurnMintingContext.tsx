import { createContext, Dispatch, SetStateAction } from "react";
import { GetBurnMintInfoQueryResult } from "../../generated/graphql";
import { BurnMintInfo } from "../ConnexProvider";

export interface BurnMintingContext {
    currentStep: number;
    setCurrentStep: Dispatch<SetStateAction<number>>;

    isSubmitted: boolean;
    setSubmitted: Dispatch<SetStateAction<boolean>>;

    collection: GetBurnMintInfoQueryResult["collection"];
    collectionInfo?: BurnMintInfo;
}

export const BurnMintingContext = createContext<BurnMintingContext>(
    new Proxy({} as any, {
        get() {
            throw new Error("Context not initialized.");
        },
    })
);
