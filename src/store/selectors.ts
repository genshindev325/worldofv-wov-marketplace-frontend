import { selector } from "recoil";
import Web3 from "web3";
import { jwtAtom } from "./atoms";

export const userAddressSelector = selector({
    key: "@User/Address",
    get: ({ get }) => {
        const jwt = get(jwtAtom);

        if (!jwt) {
            return undefined;
        }

        const data = Buffer.from(jwt.split(".")[1], "base64").toString();
        const payload = JSON.parse(data);

        return Web3.utils.toChecksumAddress(payload.address);
    },
});
