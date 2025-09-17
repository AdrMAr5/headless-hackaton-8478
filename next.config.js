const { withFaust } = require("@faustwp/core");

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  images: {
    domains: ["wildatlanticway.wpengine.com"],
  },
  trailingSlash: true,
});