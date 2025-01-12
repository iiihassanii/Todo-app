const mongoose = require('mongoose');

const server = '127.0.0.1:27017'; 
const database = 'todo-db';


function db_connect() {
      mongoose.connect(`mongodb://${server}/${database}`)
        .then(() => {
          console.log('Database connection successful');
        })
        .catch((err) => {
          console.error('Database connection error', err);
        });
}  

module.exports = db_connect;