export const removeQueryParams = (url: string) => {
    const index = url.indexOf("?");
    if (index > -1) {
        return url.slice(0, index);
    }
    return url;
};
