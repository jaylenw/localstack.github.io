const {
  override,
  babelInclude,
  addWebpackExternals
} = require("customize-cra");
const path = require("path");
const webpack = require("webpack");

module.exports = (webpackConfig) => {
  let result = override(
    babelInclude([
      path.resolve("src"),
      path.resolve("node_modules/react-material-dashboard/src")
    ]),
    addWebpackExternals({
      'next/router': 'commonjs next/router'
    })
  )(webpackConfig);
  result.module.rules.splice(1, 0, {
    test: /\.md$/,
    use: 'raw-loader'
  });
  return result;
};
