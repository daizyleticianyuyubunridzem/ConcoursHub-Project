import express from 'express';
const app = express();
import dotenv from 'dotenv';
import connectDB from './src/config/db';
import path from 'node:path';

dotenv.config();

const PORT = process.env.PORT || 3000;
 
connectDB();

//configuing ejs
app.set ('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.get('/', (req, res) => {
    res.send("welcome to concoursHub");
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});