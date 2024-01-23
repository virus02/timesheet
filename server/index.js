const { ENV } = require("./src/config");

if (ENV == "production") {
  require("@google-cloud/debug-agent").start({
    serviceContext: { enableCanary: false },
  });
}
require("babel-core/register");

exports = module.exports = require("./bin/www");
