import express from 'express';
import "./config/env";
import connectDB from './config/db';
import path from 'node:path';
import InstitutionRoutes from "./routes/institutionRoutes";
import SchoolRoutes from "./routes/schoolRoutes";
import DepartmentRoutes from "./routes/departmentRoutes";
import ProgrammeRoutes from "./routes/programmeRoutes";
import AdmissionOpportunityRoutes from "./routes/admissionOpportunityRoutes";
import ApplicationSessionRoutes from "./routes/applicationSessionRoutes";
import requirementRoutes from "./routes/requirementRoutes";
import userRoutes from './routes/userRoutes';
import studentProfileRoutes from './routes/studentProfileRoutes';
import sessionMiddleware from './config/session';
import AuthRoutes from './routes/authRoutes';
import savedOpportunityRoutes from "./routes/savedOpportunityRoutes"
import errorHandler from './middlewares/errorMiddleware';
import eligibilityRoutes from './routes/eligibilityRoutes';
import AppError from "./errors/AppError";


const app = express();

const PORT = process.env.PORT || 3000;
 
connectDB();

app.use(express.json());

//session middleware
app.use(sessionMiddleware);

app.set ('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use('/institutions', InstitutionRoutes);
app.use('/schools', SchoolRoutes);
app.use('/departments', DepartmentRoutes);
app.use('/programmes', ProgrammeRoutes);
app.use('/admission-opportunities', AdmissionOpportunityRoutes)
app.use('/application-sessions', ApplicationSessionRoutes);
app.use('/requirements', requirementRoutes);
app.use('/users', userRoutes);
app.use('/student-profiles', studentProfileRoutes);
app.use('/saved-opportunities', savedOpportunityRoutes);
app.use("/eligibility", eligibilityRoutes);

//authentication routes
app.use('/auth', AuthRoutes);

app.use(errorHandler);
app.get('/', (req, res) => {
    res.send("welcome to concoursHub");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});