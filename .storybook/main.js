const path = require("path");

module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/preset-scss",
        "storybook-addon-next-router",
    ],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-webpack5",
    },
    // See: https://github.com/storybookjs/storybook/issues/12844#issuecomment-867544160
    webpackFinal: async (config, { configType }) => {
        config.resolve.roots = [
            path.resolve(__dirname, "../public"),
            "node_modules",
        ];
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "../src"),
            "@contracts": path.resolve(__dirname, "../contracts"),
        };

        // Return the altered config
        return config;
    },
};
