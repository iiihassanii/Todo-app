const express = require( 'express');
const dotenv  = require('dotenv') ;
const db_connect = require('./config/db.js');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const regist = require('./router/register.js');
const login = require('./router/login.js');
const todoRoute = require('./router/CRUD_task.js');
const userRouter = require('./router/CRUD_user.js');

const app = express();
db_connect();

app.use(cors());
app.use(express.json());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;


app.use('/auth/*', (req, res,next) => {
    try {
        let token = req.headers['authorization'].split(' ');
        if (!token[0] || !token[1]) {
        return res.status(401).json({message: 'token not found'});
        }

        const tokenUser = jwt.verify(token[1], process.env.SECRET_KEY || "secret");
        req.user = tokenUser;
        next();
    } catch(err) {
        return res.status(401).json({message: 'Unauthorized'});
    }
});



app.use("/login", login);
app.use("/register", regist);
app.use("/auth", todoRoute);
app.use("/auth", userRouter);


app.listen(PORT, () => console.log(`Server Started on http://${HOST}:${PORT}`));