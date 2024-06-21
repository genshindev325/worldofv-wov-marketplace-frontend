const formatNumber = (n: string): string => {
    const newNumber = n.replace(/[.]/g, "");
    const formattedNumber = Number(newNumber);

    if (formattedNumber >= 1000 && formattedNumber < 1000000) {
        return Number((formattedNumber / 1000).toFixed(1)) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (formattedNumber >= 1000000) {
        return Number((formattedNumber / 1000000).toFixed(1)) + "M"; // convert to M for number from > 1 million
    }

    // if value < 1000, nothing to do
    return n;
};

export default formatNumber;
