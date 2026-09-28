import express from 'express';
const app = express();
import dotenv from 'dotenv';
import connectDB from './config/db';
import path from 'node:path';
import InstitutionRoutes from "./routes/institutionRoutes";
import SchoolRoutes from "./routes/schoolRoutes";
import DepartmentRoutes from "./routes/departmentRoutes";
import ProgrammeRoutes from "./routes/programmeRoutes";
import AdmissionOpportunityRoutes from "./routes/admissionOpportunityRoutes";
import ApplicationSessionRoutes from "./routes/applicationSessionRoutes";
import requirementRoutes from "./routes/requirementRoutes";

dotenv.config();

const PORT = process.env.PORT || 3000;
 
connectDB();

app.use(express.json());

//configuring ejs
app.set ('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use('/institutions', InstitutionRoutes);
app.use('/schools', SchoolRoutes);
app.use('/departments', DepartmentRoutes);
app.use('/programmes', ProgrammeRoutes);
app.use('/admission-opportunities', AdmissionOpportunityRoutes)
app.use('/application-sessions', ApplicationSessionRoutes);
app.use('/requirements', requirementRoutes);

app.get('/', (req, res) => {
    res.send("welcome to concoursHub");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});