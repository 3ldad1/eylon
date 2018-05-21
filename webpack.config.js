const path = require('path');

module.exports = {
    entry: "./src/app.js",

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },

    output: {
        path: path.resolve(__dirname,'public'),
        filename: "bundle.js"
    }
}