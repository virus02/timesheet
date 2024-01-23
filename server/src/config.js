const NODE_ENV = process.env.NODE_ENV || "development";

const ENV_VARIABLES = {
  development:{}
}

module.exports = ENV_VARIABLES[NODE_ENV];