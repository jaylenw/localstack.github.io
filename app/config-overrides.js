const {
  override,
  babelInclude
} = require("customize-cra");
const path = require("path");

module.exports = override(
  babelInclude([
    path.resolve("src"),
    path.resolve("node_modules/react-material-dashboard/src")
  ])
);
