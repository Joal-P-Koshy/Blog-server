const express = require('express');
const cors = require('cors');
const {connect} = require('mongoose');
require('dotenv').config()
const upload = require('express-fileupload')

const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');
const { notFound, errorHandler } = require('./Middlewares/errorMiddleware');

const app = express();

connect(process.env.DATABASE_URL).then();
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(upload())
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT || 5000, () => console.log(`server running successfully at port : ${PORT}`));