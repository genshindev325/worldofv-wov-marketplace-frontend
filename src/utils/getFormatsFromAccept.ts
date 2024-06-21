const getFormatsFromAccept = (formats: string[]): string[] => {
    return formats.reduce((acc: string[], format: string) => {
        const [type, subtype] = format.split("/");
        acc.push(subtype.toUpperCase());
        return acc;
    }, []);
};

export default getFormatsFromAccept;
