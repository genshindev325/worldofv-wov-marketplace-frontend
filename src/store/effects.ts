import {
    CookieValueTypes,
    getCookie,
    removeCookies,
    setCookie,
} from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";
import { AtomEffect } from "recoil";

export function cookiesEffectFactory<T extends CookieValueTypes>(
    key: string,
    options?: OptionsType
): AtomEffect<T> {
    return ({ setSelf, onSet }) => {
        const savedValue = getCookie(key) as T;

        if (savedValue) {
            setSelf(savedValue);
        }

        onSet((newValue, _, isReset) => {
            if (isReset) {
                removeCookies(key);
            } else {
                setCookie(key, newValue, options);
            }
        });
    };
}
