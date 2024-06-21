export const formatUsername = (username: string) => {
    if (username?.length > 14) {
        const start = username.slice(0, 6);
        const end = username.slice(-4);
        return `${start}...${end}`;
    }
    return username;
};
