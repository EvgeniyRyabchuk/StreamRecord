const { error } = require('console');

const sqlite3 = require('sqlite3').verbose(); 

let sql; 

const db = new sqlite3.Database('./data/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if(err) return console.error(err.message);
});

// sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT)';
// db.run(sql); 

//drop table
// sql = 'DROP TABLE users' 
// db.run(sql);
//insert 
// sql = 'INSERT INTO users(name) values(?)';
// db.run(sql, ['name'], (err) => {
//     if(err) return console.error(err.message); 
// })

// //select 
// sql = 'SELECT * FROM users'; 
// db.all(sql, [], (err, rows) => {
//     if(err) return console.error(err.message); 
//     rows.forEach((row) => {
//         console.logs(row);
//     })
// })

// update 
// sql = 'UPDATE users SET name = ? WHERE id = ?';
// db.run(sql, ['123', '1'], (err) => {
//     if(err) return console.logs(err.message);
// })

//delete 
// sql = 'DELETE FROM users WHERE id = ?';
// db.run(sql, ['1'], (err) => {
//     if(err) return console.logs(err.message);
// })


