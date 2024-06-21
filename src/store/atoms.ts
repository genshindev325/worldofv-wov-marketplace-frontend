import { atom } from "recoil";
import { cookiesEffectFactory } from "./effects";

export const jwtAtom = atom<string | undefined>({
    key: "@User/Jwt",
    default: undefined,
    effects: [
        cookiesEffectFactory("jwt", {
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 1 month
        }),
    ],
});

export const gridTypeAtom = atom<"small" | "large">({
    key: "@Grid/Type",
    default: "small",
    effects: [cookiesEffectFactory("gridType")],
});
