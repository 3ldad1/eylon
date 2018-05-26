const path = require('path');

module.exports = {
    entry: "./src/app.js",

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }
            },
        ],
    },
    resolve: {
        extensions: ['*','.js','.jsx']
    },

    output: {
        path: path.resolve(__dirname,'public'),
        filename: "bundle.js"
    }
};