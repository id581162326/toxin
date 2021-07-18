import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import path from 'path';
import webpack from 'webpack';
import * as fs from 'fs';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHardDiskPlugin from 'html-webpack-harddisk-plugin';

type BuildType = 'dev' | 'prod';

const toHtmlWebpackPluginFrom = (buildType: BuildType, folder: string) => (filename: string) => new HtmlWebpackPlugin({
  filename: `${filename}.html`,
  template: `./${folder}/${filename}/index.njk`,
  inject: 'body',
  minify: true,
  ...(buildType === 'prod' ? {alwaysWriteToDisk: true} : {})
});

const getHtmlWebpackPluginsFrom = (buildType: BuildType, folder: string) => pipe(
  path.resolve(__dirname, '..', 'src', folder),
  (x) => fs.readdirSync(x),
  pipe(toHtmlWebpackPluginFrom(buildType, folder), A.map)
);

const getTypeDependingPlugins = (buildType: BuildType): webpack.WebpackPluginInstance[] => {
  switch (buildType) {
    case 'dev': {
      return ([
        new webpack.HotModuleReplacementPlugin(),
        ...getHtmlWebpackPluginsFrom(buildType, 'ui-kit')
      ]);
    }

    case 'prod': {
      return ([
        ...getHtmlWebpackPluginsFrom(buildType, 'pages'),
        new HtmlWebpackHardDiskPlugin(),
        new MiniCssExtractPlugin({filename: 'css/[name].css'})
      ]);
    }
  }
};

const getTypeDependingConfigProps: (buildType: BuildType) => webpack.Configuration = (buildType) => {
  switch (buildType) {
    case 'dev': {
      return ({
        mode: 'development',
        devtool: 'source-map',
        devServer: {
          hot: true,
          contentBase: path.resolve('..', 'dist'),
          port: 8080,
          inline: true,
          clientLogLevel: 'silent'
        }
      });
    }

    case 'prod': {
      return ({
        mode: 'production',
        optimization: {
          minimize: true,
          minimizer: [new TerserJSPlugin({extractComments: false}), new CssMinimizerWebpackPlugin()]
        }
      });
    }
  }
};

export const getPlugins = (buildType: BuildType): webpack.WebpackPluginInstance[] => (
  [new CleanWebpackPlugin(), ...getTypeDependingPlugins(buildType)]
);

const getNunjucksFilters = () => pipe(
  path.resolve(__dirname, 'nunjucks-filters'),
  (x) => fs.readdirSync(x),
  A.map((file) => ({[file.replace('.js', '')]: path.join(__dirname, 'nunjucks-filters', `${file}`)})),
  A.reduce({}, (acc, record) => ({...acc, ...record}))
);

const getPostcssApplySets = () => pipe(
  path.resolve(__dirname, 'postcss-apply-sets'),
  (x) => fs.readdirSync(x),
  A.map((file) => ({[file.replace('.js', '')]: require(path.join(__dirname, 'postcss-apply-sets', `${file}`))})),
  A.reduce({}, (acc, record) => ({...acc, ...record}))
);

export const getRules = (buildType: BuildType): webpack.RuleSetRule[] => ([
  {
    test: /\.njk$/,
    use: {
      loader: 'simple-nunjucks-loader',
      options: {
        searchPaths: [
          path.resolve(__dirname, '..', 'src'),
          path.resolve(__dirname, '..', 'src', 'components')
        ],
        filters: getNunjucksFilters()
      }
    },
    exclude: /node_modules/
  },
  {
    test: /\.js$/,
    use: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.ts$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    use: [
      ...(buildType === 'prod' ? [{loader: MiniCssExtractPlugin.loader}] : ['style-loader']),
      'css-loader',
      {
        loader: 'postcss-loader', options: {
          postcssOptions: {
            plugins: [
              ['postcss-preset-env', {
                stage: 3,
                features: {'nesting-rules': true, 'not-pseudo-class': true},
                ...((buildType === 'prod') ? {browsers: 'last 2 versions'} : {})
              }],
              ['postcss-apply', {
                sets: getPostcssApplySets()
              }]
            ]
          }
        }
      }
    ]
  },
  {
    test: /\.(ttf|eot|woff|woff2|)$/,
    type: 'asset/resource'
  },
  {
    test: /\.(ico|svg|jpg|png|gif|webmanifest)$/,
    type: 'asset/inline',
  }
]);

export const getConfig = (buildType: BuildType): webpack.Configuration => ({
  ...getTypeDependingConfigProps(buildType),
  entry: './main.ts',
  output: {
    publicPath: '',
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  context: path.resolve(__dirname, '..', 'src'),
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.ts', '.js', '.css'],
    alias: {
      'assets': path.resolve(__dirname, '..', 'src/assets'),
      'globals': path.resolve(__dirname, '..', 'src/globals'),
      'atoms': path.resolve(__dirname, '..', 'src/components/atoms'),
      'molecules': path.resolve(__dirname, '..', 'src/components/molecules'),
      'organisms': path.resolve(__dirname, '..', 'src/components/organisms')
    }
  }
});