module.exports = {
    i18n: {
        locales: ["en", "it"],
        defaultLocale: "en",
        localeDetection: false,
    },
    // react: { useSuspense: false },
    reloadOnPrerender: process.env.NODE_ENV === "development",
};
