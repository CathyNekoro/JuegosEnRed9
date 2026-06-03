import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'development',
  entry: './src/client/game.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,         // limpia dist/ en cada build
  },
  devtool: 'source-map', // para poder debuggear en el navegador con tu código original
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/Assets', to: 'Assets' },
        { from: 'public/Lib', to: 'Lib' },
        { from: 'public/styles.css', to: 'styles.css' },
      ],
    }),
  ],
  externals: {
    phaser: 'Phaser'
  },
};