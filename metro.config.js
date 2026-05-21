const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// reanimated 4.x 需要 Metro 支持 package.json exports
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
