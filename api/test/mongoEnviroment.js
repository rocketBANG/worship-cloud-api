const NodeEnvironment = require('jest-environment-node');
const path = require('path');
const fs = require('fs');
var mongoose = require('mongoose');

const globalConfigPath = path.join(__dirname, 'globalConfig.json');


module.exports = class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    console.log('Setup MongoDB Test Environment');

    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));

    this.global.__MONGO_URI__ = globalConfig.mongoUri;
    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName;

    mongoose.Promise = global.Promise;
    await mongoose.connect(globalConfig.mongoUri);

    await super.setup();
  }

  async teardown() {
    console.log('Teardown MongoDB Test Environment');
    await mongoose.disconnect();

    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}
