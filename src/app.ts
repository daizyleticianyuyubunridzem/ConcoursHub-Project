import express from 'express';
import "./config/env";
import connectDB from './config/db';
import path from 'node:path';
import { existsSync } from 'node:fs';
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
import helmet from 'helmet';
import studentDashboardRoutes from "./routes/studentDashboardRoutes";
import studentProfileViewRoutes from "./routes/studentProfileViewRoutes";
import studentOpportunityViewRoutes from "./routes/studentOpportunityViewRoutes";
import adminViewRoutes from "./routes/adminViewRoutes";
import publicExploreRoutes from "./routes/publicExploreRoutes";

const app = express();
app.use(helmet());

const PORT = process.env.PORT || 3000;
 
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

//session middleware
app.use(sessionMiddleware);

app.set ('view engine', 'ejs');
const compiledViews = path.join(__dirname, "views");
app.set("views", existsSync(compiledViews) ? compiledViews : path.resolve(__dirname, "../src/views"));

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
app.use("/explore", publicExploreRoutes);
import authViewRoutes from "./routes/authViewRoutes";

// Student dashboard
app.use("/student", studentDashboardRoutes);
app.use("/student/profile", studentProfileViewRoutes);
app.use("/student", studentOpportunityViewRoutes);
app.use("/admin", adminViewRoutes);

//authentication routes
app.use('/auth', AuthRoutes);
app.use("/", authViewRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});
