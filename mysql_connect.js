const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'hmsk6534',
    port : 3306,
    database : 'music_DB',
    insecureAuth : true
});

connection.connect();

connection.query('select count(*) from music_table;', function(err, rows, fields) {

    if(!err)
    console.log('The solution is : ', rows);
    else 
    console.log('Error while performing Query,' ,err);
}); 

connection.end();