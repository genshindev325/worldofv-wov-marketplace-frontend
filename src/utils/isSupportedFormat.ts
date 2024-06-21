const isSupportedFormat = (file: File, supportedFormats: string[]) => {
    for (const format of supportedFormats) {
        const valid = format.endsWith("*")
            ? file.type.startsWith(format.slice(0, -1))
            : file.type === format;

        if (valid) {
            return true;
        }
    }

    return false;
};

export default isSupportedFormat;
