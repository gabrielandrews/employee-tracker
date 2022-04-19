const mysql = require("mysql2");
require('dotenv').config()

class EmployeeDatabase {

    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB
        });
    }

    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err ) {
                    console.log(err.sql);
                    return reject( err );
                }
                resolve( rows );
          } );
        } );
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end( err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

module.exports = EmployeeDatabase 