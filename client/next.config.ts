import type { NextConfig } from "next";

const nextConfig: NextConfig = {
reactStrictMode: false,
    reactCompiler: true,
    compiler: {
        relay: {
            src: "./src",
            artifactDirectory: "./src/__generated__",
            language: "typescript",
            eagerEsModules: true,
        },
    },
};

export default nextConfig;
