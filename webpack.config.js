const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, './src/index.tsx'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true,
  },
  cache: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]ss|js|ts)/,
        enforce: 'pre',
        loader: 'import-glob-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.(png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[hash][ext][query]',
        },
      },
      {
        test: /\.(gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/gifs/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({     
        title: 'TTscore',
        filename: '[name].html',
        template: 'index.ejs',
    }),
    new NodePolyfillPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  mode: 'development',
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "/dist"),
    },
    hot: true,
    port: 3000,
    compress: true,
    historyApiFallback: true,
    // config the proxy when api needed
    proxy: {
      '/': {
        target: 'https://todos.appsquare.io/',
        secure: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@/static": path.resolve(__dirname, "./public/static"),
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
  },
};
