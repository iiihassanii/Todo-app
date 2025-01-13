const mongoose = require('mongoose');
const dotenv  = require('dotenv') ;
dotenv.config();

const server = '127.0.0.1:27017'; 
const database = 'todo-db';
MONGO_URI= process.env.MONGO_URI;


function db_connect() {
      mongoose.connect(MONGO_URI ? MONGO_URI : `mongodb://${server}/${database}`)
        .then(() => {
          console.log('Database connection successful');
        })
        .catch((err) => {
          console.error('Database connection error', err);
        });
}  

module.exports = db_connect;