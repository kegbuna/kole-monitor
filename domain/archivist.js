const mysql = require('mysql');

export class Archivist {
  constructor(config) {
    const connection = mysql.createConnection({
      host: config.host,
      database: config.database,
      user: config.user,
      password: config.password,
    });

    connection.connect();
  }
}
