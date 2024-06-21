if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (
        searchValue: string | RegExp,
        replaceValue: any
    ) {
        // If a regex pattern
        if (
            Object.prototype.toString.call(searchValue).toLowerCase() ===
            "[object regexp]"
        ) {
            return this.replace(searchValue, replaceValue);
        }

        // If a string
        return this.replace(new RegExp(searchValue, "g"), replaceValue);
    };
}

export {};
