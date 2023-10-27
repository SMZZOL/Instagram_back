require('dotenv').config()
const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors') 
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const connectDB = require("./config/dbConnect") 
const cookieParser = require("cookie-parser")
const PORT= process.env.PORT || 3500//http://localhost:3500

connectDB()

app.use(bodyParser.json({ limit: '3mb' })); // JSON 데이터 크기 제한 설정
app.use(bodyParser.urlencoded({ limit: '3mb', extended: true }));

app.use(express.json())//json 파일을 parsing

app.use(cookieParser())

app.use(cors(corsOptions))

app.use('/users', require("./routes/userRoutes"))
app.use('/auth', require("./routes/authRoutes"))
app.use('/feeds', require("./routes/feedRoutes"))
app.use('/stories', require("./routes/feedRoutes"))

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
})