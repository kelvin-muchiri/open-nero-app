const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  return {
    entry: './server/index.ts',
    target: 'node',
    externals: [
      nodeExternals({
        modulesDir: path.resolve(__dirname, '../../node_modules'),
      }),
      nodeExternals({ modulesFromFile: true }),
      'react-helmet',
    ],
    output: {
      path: path.resolve('server-build'),
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.server.json',
              },
            },
          ],
          exclude: [/node_modules/, path.resolve(__dirname, '../../node_modules/')],
        },
        {
          test: /\.(css|scss)$/,
          use: ['ignore-loader'], // css assets will be build by the client so we ignore
        },
      ],
    },
    plugins: [new Dotenv()],
  };
};
