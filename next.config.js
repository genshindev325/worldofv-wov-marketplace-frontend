const path = require("path");
const intercept = require("intercept-stdout");
const { i18n } = require("./next-i18next.config");

// Hide duplicate atom key warnings.
// See: https://github.com/facebookexperimental/Recoil/issues/733
if (process.env.NODE_ENV === "development") {
    intercept((message) => {
        if (message.includes("Expectation Violation: Duplicate atom key")) {
            return "";
        } else {
            return message;
        }
    });
}

/** @type {import('next').NextConfig} */
module.exports = {
    distDir: "dist",
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    images: {
        domains: [
            "localhost",
            "ipfs.io",
            "worldofv-marketplace.mypinata.cloud",
            "wov-marketplace-main.s3.eu-central-1.amazonaws.com",
        ],
    },
    i18n,
    compiler: {
        styledComponents: true,
    },
    compress: true,
    experimental: {
        scrollRestoration: true,
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.bin$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "url-loader",
                    options: {
                        encoding: false,
                        mimetype: false,
                        generator: (content) => {
                            return Buffer.from(content).toString();
                        },
                    },
                },
            ],
        });

        return config;
    },
    async redirects() {
        return [
            {
                source: "/token/:tokenId(\\d+)",
                destination: `/token/${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}/:tokenId`,
                permanent: true,
            },
            {
                source: "/:path*",
                has: [{ type: "host", value: "marketplace.worldofv.art" }],
                destination: "https://worldofv.art/:path*",
                permanent: true,
            },
            ...(process.env.NEXT_PUBLIC_MAINTENANCE?.toLowerCase() == "true"
                ? [
                      {
                          source: "/((?!maintenance|img).*)",
                          destination: "/maintenance",
                          permanent: false,
                      },
                      {
                          source: "/(maintenance/.*)",
                          destination: "/maintenance",
                          permanent: false,
                      },
                  ]
                : [
                      {
                          source: "/maintenance",
                          destination: "/",
                          permanent: false,
                      },
                  ]),
        ];
    },
};
