module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [
  
      // First application
      {
        name      : 'WorshipCloudApi',
        script    : 'server.js',
        watch     : true,
        env: {
          COMMON_VARIABLE: 'true'
        },
        env_production : {
          NODE_ENV: 'production'
        }
      }
    ]
}