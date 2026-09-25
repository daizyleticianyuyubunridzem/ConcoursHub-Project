import express from 'express';
const app = express();
import dotenv from 'dotenv';
import connectDB from './config/db';
import path from 'node:path';
import InstitutionRoutes from "./routes/institutionRoutes";

dotenv.config();

const PORT = process.env.PORT || 3000;
 
connectDB();

app.use(express.json());

//configuring ejs
app.set ('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use('/institutions', InstitutionRoutes);

app.get('/', (req, res) => {
    res.send("welcome to concoursHub");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});