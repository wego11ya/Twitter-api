module.exports = {
  development: {
    username: "root",
    password: "password",
    database: "twitter_workspace",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: "password",
    database: "twitter_workspace_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  production: {
    host: process.env.RDS_HOSTNAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
    dialect: "mysql",
  },
  travis: {
    username: "travis",
    database: "ac_twitter_workspace_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  ghactions: {
    username: "root",
    database: "ac_twitter",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
