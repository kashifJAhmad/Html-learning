const mysql = require("mysql2");

console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Password:", JSON.stringify(process.env.DB_PASSWORD));
console.log("Password Length:", process.env.DB_PASSWORD?.length);
console.log("Database:", process.env.DB_NAME);

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kashif@8668",
    database: "student_tracker"
});

connection.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);
    } else {
        console.log("✅ MySQL Connected Successfully");
    }
});

module.exports = connection;