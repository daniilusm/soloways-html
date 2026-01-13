const webpack = require('webpack');

const glob = require('glob');
const __paths = require('./paths.config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const distPath = path.join(__dirname, __paths.root);

const portFinderSync = require('portfinder-sync');
const { VueLoaderPlugin } = require('vue-loader');
const SvgSpritePlugin = require('svg-sprite-loader/plugin');
const port = portFinderSync.getPort(3000);

const filePath = path.join(__dirname, 'src');
const filePathResolve = path.resolve(__dirname, 'src');

const htmlPlugins = glob
  .sync('*.twig', {
    matchBase: true,
    cwd: path.join(__dirname, './src/pages/'),
  })
  .map((twigFile) => {
    const twigFileObj = path.parse(twigFile);

    return new HtmlWebpackPlugin({
      filename: twigFileObj.name + '.html',
      template: path.join(__dirname, './src/pages', twigFile),
      inject: false,
    });
  });

const config = {
  mode: isProduction ? 'production' : 'development',

  entry: () => {
    let entries = {
      index: [],
    };

    // Подключаем корневые скрипты /js
    entries.index.push(...glob.sync(__paths.js.main));

    // Подключаем корневые стили /styles
    entries.index.push(...glob.sync(__paths.css.main));

    // Подключаем стили компонентов
    entries.index.push(...glob.sync(__paths.css.components.src));

    // Подключаем скрипты компонентов
    entries.index.push(...glob.sync(__paths.js.components.src));

    // Подключение svg spite
    entries.index.push(...glob.sync(__paths.svg.src));

    return entries;
  },

  output: {
    clean: true,
    filename: 'js/[name].min.js',
    path: distPath,
  },

  devServer: {
    historyApiFallback: true,
    static: {
      directory: filePathResolve,
    },
    watchFiles: filePath,
    host: '0.0.0.0',
    port: port,
    open: false,
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {},
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              api: 'modern',
              additionalData: `@use '~styles/bootstrap' as *;`,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
        exclude: [path.join(__dirname, './src/img/sprites')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src/',
              publicPath: '../',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.join(__dirname, './src/img/sprites')],
        loader: 'svg-sprite-loader',
        options: {
          symbolId: (filePath) => `icon-${path.parse(filePath).name}`,
          spriteFilename: __paths.svg.name,
          extract: true,
        },
      },
      {
        test: /\.twig$/,
        use: [
          'raw-loader',
          {
            loader: 'twig-html-loader',
            options: {
              data: require('./tasks/readData')(isDevelopment, __dirname),
              filters: require('./tasks/filters'),
              functions: require('./tasks/functions'),
              extend: require('./tasks/extends'),
              namespaces: {
                organisms: './src/include/&organisms',
                molecules: './src/include/^molecules',
                atoms: './src/include/@atoms',
                layouts: './src/include/layouts',
                mixins: './src/include/+mixins',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          // Перемещам содержимое static в dist
          from: 'src/static/',
          toType: 'dir',
        },
        {
          // Перемещаем содержимое img в dist/img
          from: 'src/img/',
          to: 'img',
        },
      ],
    }),
    new VueLoaderPlugin(),
    new SvgSpritePlugin({ plainSprite: true }),
  ],

  // optimization: {
  //   minimize: isProduction,
  //   minimizer: isProduction
  //     ? [new TerserPlugin(), new OptimizeCssAssetsPlugin()]
  //     : [],
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },

  stats: {
    all: false,
    modules: false,
    errors: true,
    entrypoints: false,
    children: false,
  },

  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, 'src'),
    watchFiles: path.join(__dirname, 'src'),
    host: '0.0.0.0',
    port: port,
    open: false,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
  },

  resolve: {
    extensions: ['.js', '.json', '.twig', '.scss'],
    alias: {
      styles: path.resolve(__dirname, './src/styles'),
      vue$: isProduction ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js',
      '&': path.resolve(__dirname, './src/include/&organisms/'),
      '^': path.resolve(__dirname, './src/include/^molecules/'),
      '@': path.resolve(__dirname, './src/include/@atoms/'),
      '~': path.resolve(__dirname, './src/'),
    },
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
  }

  return config;
};
