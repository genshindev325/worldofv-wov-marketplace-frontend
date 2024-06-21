const clearFormattedNumber = (n: string): number => {
    let newNumberFormatted = n.replace(/[kKM]/g, "");
    let newNumbers = newNumberFormatted.split(".");

    let newNumber = 0;

    if (n.includes("k") || n.includes("K")) {
        newNumber =
            newNumbers.length > 1
                ? Number(newNumbers[0] + "000") + Number(newNumbers[1] + "00")
                : Number(newNumbers[0] + "000");
    } else if (n.includes("M")) {
        newNumber =
            newNumbers.length > 1
                ? Number(newNumbers[0] + "000000") +
                  Number(newNumbers[1] + "00000")
                : Number(newNumbers[0] + "000000");
    }

    return newNumber;
};

export default clearFormattedNumber;
