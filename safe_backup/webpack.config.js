const path = require("path");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}) => {
    const config = {
        entry: "./src/index.js",
        output: {
            path: path.resolve(__dirname, "lib/"),
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                }
            ]
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        plugins: []
    };

    if (env.analyze) {
        config.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-report.html'
        }));
    }

    return config;
};