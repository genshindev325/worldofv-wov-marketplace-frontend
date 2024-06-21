import { CID } from "multiformats";

const regex = /^ipfs:\/\/[ipfs\/]*([^\/?#]+)\/*([\S]+)?/;
const removeTrailingSlash = (str: string): string => str.replace(/[\/.]$/, "");

export type IpfsObject = {
    url?: string;
    cid: string;
    path?: string;
};

export const isIPFS = (ipfs: string): boolean => !!regex.exec(ipfs);

export const parseIPFS = (url: string): IpfsObject | undefined => {
    const regexMatch = url.match(regex);

    // Match "ipfs://" URLs
    if (regexMatch) {
        const [url, cid, path] = regexMatch;
        return { url, cid, path };
    }

    // Extract CID and path from generic URL
    const splittedURL = url.split("/");
    for (let i = 0; i < splittedURL.length; i++) {
        try {
            const cid = CID.parse(splittedURL[i]).toString();
            const path = splittedURL.slice(i + 1).join() || undefined;

            return {
                url: `ipfs://${cid}${path ? `/${path}` : ""}`,
                cid,
                path,
            };
        } catch (err) {}
    }

    return undefined;
};

export const formatIPFS = (
    ipfsObject: IpfsObject,
    gateway = "ipfs://"
): string | undefined => {
    if (ipfsObject) {
        const { cid, path } = ipfsObject;
        return `${removeTrailingSlash(gateway)}/${cid}${
            path ? `/${path}` : ""
        }`;
    }

    return undefined;
};

export const convertIPFS = (url: string, gateway?: string) =>
    formatIPFS(parseIPFS(url)!, gateway);
