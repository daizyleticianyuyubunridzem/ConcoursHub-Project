import { Request, Response, NextFunction } from "express";
import Institution from "../models/institutionModel";
import School from "../models/schoolModel";
import Department from "../models/departmentModel";
import Programme from "../models/programmeModel";
import AdmissionOpportunity from "../models/admissionOpportunityModel";
import ApplicationSession from "../models/applicationSessionModel";
import Requirement from "../models/requirementModel";
import User from "../models/userModel";
import StudentProfile from "../models/studentProfileModel";
import UserService from "../services/userService";
import { updateAdminAccountSchema } from "../validators/userValidator";

type Field = { name: string; label: string; type?: string; required?: boolean; multiple?: boolean; defaultValue?: string; selectedValue?: string; options?: { value: string; label: string }[] };
type Row = { id: string; cells: Record<string, string>; record: Record<string, unknown> };
const choice = (items: any[], name = "name") => items.map((item) => ({ value: item._id.toString(), label: item[name] }));
const refId = (value: any) => value && typeof value === "object" ? value._id?.toString() || "" : value?.toString?.() || "";
const dateInput = (value: any) => value ? new Date(value).toISOString().slice(0, 10) : "";
const row = (item: any, cells: Record<string, unknown>, record: Record<string, unknown>): Row => ({
    id: item._id.toString(),
    cells: Object.fromEntries(Object.entries(cells).map(([key, value]) => [key, value == null || value === "" ? "—" : String(value)])),
    record,
});

class AdminViewController {
    async dashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const [institutions, schools, programmes, opportunities, sessions, requirements, students] = await Promise.all([
                Institution.countDocuments(), School.countDocuments(), Programme.countDocuments(), AdmissionOpportunity.countDocuments(),
                ApplicationSession.countDocuments(), Requirement.countDocuments(), StudentProfile.countDocuments(),
            ]);
            res.render("admin/dashboard", { active: "dashboard", counts: { institutions, schools, programmes, opportunities, sessions, requirements, students } });
        } catch (error) { next(error); }
    }

    async resource(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = String(req.params.page);
            if (page === "users") {
                const [students, admins] = await Promise.all([
                    User.find({ role: "student" }).select("name email isActive createdAt").sort({ createdAt: -1 }).lean(),
                    User.find({ role: "admin" }).select("name email isActive createdAt").sort({ createdAt: -1 }).lean(),
                ]);
                res.render("admin/users", { active: "users", students, admins, currentAdminId: req.session.userId });
                return;
            }
            const [institutions, schools, departments, programmes, opportunities, sessions] = await Promise.all([
                Institution.find().sort({ name: 1 }).lean(),
                School.find().populate("institution").sort({ name: 1 }).lean(),
                Department.find().populate({ path: "school", populate: { path: "institution" } }).sort({ name: 1 }).lean(),
                Programme.find().populate({ path: "department", populate: { path: "school", populate: { path: "institution" } } }).sort({ name: 1 }).lean(),
                AdmissionOpportunity.find().populate("programmes").sort({ name: 1 }).lean(),
                ApplicationSession.find().populate("admissionOpportunity").sort({ applicationDeadline: 1 }).lean(),
            ]);
            const refOptions = {
                institutions: choice(institutions), schools: choice(schools), departments: choice(departments),
                programmes: choice(programmes), opportunities: choice(opportunities), sessions: choice(sessions, "academicYear"),
            };
            const configs: Record<string, { title: string; description: string; endpoint: string; fields: Field[]; columns: string[]; rows: Row[] }> = {
                institutions: { title: "Institutions", description: "Keep official institution names, locations and source websites current.", endpoint: "/institutions", fields: [
                    { name: "name", label: "Institution name", required: true }, { name: "acronymn", label: "Acronym" }, { name: "location", label: "City or town", required: true }, { name: "region", label: "Region", required: true }, { name: "website", label: "Official website", type: "url" }, { name: "description", label: "Description", type: "textarea" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: "true" },
                ], columns: ["name", "location", "region", "website"], rows: institutions.map((x: any) => row(x, { name: x.name, location: x.location, region: x.region, website: x.website }, { name: x.name, acronymn: x.acronymn, location: x.location, region: x.region, website: x.website, description: x.description, isActive: x.isActive })) },
                schools: { title: "Schools", description: "Organise schools under their parent institution.", endpoint: "/schools", fields: [
                    { name: "name", label: "School name", required: true }, { name: "acronym", label: "Acronym" }, { name: "institution", label: "Institution", type: "select", options: refOptions.institutions, required: true }, { name: "description", label: "Description", type: "textarea" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: "true" },
                ], columns: ["name", "institution", "acronym"], rows: schools.map((x: any) => row(x, { name: x.name, institution: x.institution?.name, acronym: x.acronym }, { name: x.name, acronym: x.acronym, institution: refId(x.institution), description: x.description, isActive: x.isActive })) },
                departments: { title: "Departments", description: "Keep academic departments connected to the right school.", endpoint: "/departments", fields: [
                    { name: "name", label: "Department name", required: true }, { name: "acronym", label: "Acronym" }, { name: "school", label: "School", type: "select", options: refOptions.schools, required: true }, { name: "description", label: "Description", type: "textarea" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: "true" },
                ], columns: ["name", "school", "acronym"], rows: departments.map((x: any) => row(x, { name: x.name, school: x.school?.name, acronym: x.acronym }, { name: x.name, acronym: x.acronym, school: refId(x.school), description: x.description, isActive: x.isActive })) },
                programmes: { title: "Programmes", description: "Maintain the programmes attached to each department.", endpoint: "/programmes", fields: [
                    { name: "name", label: "Programme name", required: true }, { name: "acronym", label: "Acronym" }, { name: "department", label: "Department", type: "select", options: refOptions.departments, required: true }, { name: "description", label: "Description", type: "textarea" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: "true" },
                ], columns: ["name", "department", "acronym"], rows: programmes.map((x: any) => row(x, { name: x.name, department: x.department?.name, acronym: x.acronym }, { name: x.name, acronym: x.acronym, department: refId(x.department), description: x.description, isActive: x.isActive })) },
                opportunities: { title: "Concours", description: "Add concours information and connect it to one or more programmes.", endpoint: "/admission-opportunities", fields: [
                    { name: "name", label: "Concours name", required: true }, { name: "type", label: "Category", required: true }, { name: "programmes", label: "Programmes", type: "select", multiple: true, options: refOptions.programmes }, { name: "officialSource", label: "Official information URL", type: "url" }, { name: "description", label: "Description", type: "textarea" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: "true" },
                ], columns: ["name", "type", "programmes", "officialSource"], rows: opportunities.map((x: any) => row(x, { name: x.name, type: x.type, programmes: x.programmes?.map((p: any) => p.name).join(", "), officialSource: x.officialSource }, { name: x.name, type: x.type, programmes: x.programmes?.map((p: any) => refId(p)) || [], officialSource: x.officialSource, description: x.description, isActive: x.isActive })) },
                sessions: { title: "Concours publishing", description: "Record dates and official application links, then publish verified sessions to student listings.", endpoint: "/application-sessions", fields: [
                    { name: "admissionOpportunity", label: "Concours", type: "select", options: refOptions.opportunities, required: true }, { name: "academicYear", label: "Academic year", required: true }, { name: "status", label: "Status", required: true, defaultValue: "Upcoming" }, { name: "applicationStartDate", label: "Applications open", type: "date" }, { name: "applicationDeadline", label: "Deadline", type: "date" }, { name: "examinationDate", label: "Examination date", type: "date" }, { name: "officialApplicationUrl", label: "Official application page", type: "url" }, { name: "lastVerifiedAt", label: "Last verified", type: "date" }, { name: "isPublished", label: "Published to students", type: "checkbox" },
                ], columns: ["opportunity", "academicYear", "status", "applicationDeadline", "isPublished"], rows: sessions.map((x: any) => row(x, { opportunity: x.admissionOpportunity?.name, academicYear: x.academicYear, status: x.status, applicationDeadline: dateInput(x.applicationDeadline), isPublished: x.isPublished ? "Published" : "Draft" }, { admissionOpportunity: refId(x.admissionOpportunity), academicYear: x.academicYear, status: x.status, applicationStartDate: dateInput(x.applicationStartDate), applicationDeadline: dateInput(x.applicationDeadline), examinationDate: dateInput(x.examinationDate), officialApplicationUrl: x.officialApplicationUrl, lastVerifiedAt: dateInput(x.lastVerifiedAt), isPublished: x.isPublished })) },
                requirements: { title: "Requirements", description: "Capture the exact published requirements for an application session.", endpoint: "/requirements", fields: [
                    { name: "applicationSession", label: "Application session", type: "select", options: refOptions.sessions, required: true }, { name: "type", label: "Requirement type", type: "select", options: ["subject", "series", "background", "age"].map((v) => ({ value: v, label: v })) , required: true }, { name: "name", label: "Requirement title", required: true }, { name: "description", label: "Details", type: "textarea" }, { name: "level", label: "Exam level", type: "select", options: [{ value: "o_level", label: "O-Level" }, { value: "a_level", label: "A-Level" }] }, { name: "subject", label: "Subject" }, { name: "minimumGrade", label: "Minimum grade", type: "select", options: ["A", "B", "C", "D", "E", "F"].map((v) => ({ value: v, label: v })) }, { name: "requiredSeries", label: "Required series" }, { name: "requiredBackground", label: "Required background", type: "select", options: [{ value: "general", label: "General" }, { value: "technical", label: "Technical" }] }, { name: "minimumAge", label: "Minimum age", type: "number" }, { name: "maximumAge", label: "Maximum age", type: "number" }, { name: "isMandatory", label: "Mandatory", type: "checkbox", defaultValue: "true" },
                ], columns: ["name", "type", "applicationSession", "isMandatory"], rows: await Requirement.find().populate("applicationSession").sort({ name: 1 }).lean().then((items: any[]) => items.map((x) => row(x, { name: x.name, type: x.type, applicationSession: x.applicationSession?.academicYear, isMandatory: x.isMandatory ? "Yes" : "No" }, { applicationSession: refId(x.applicationSession), type: x.type, name: x.name, description: x.description, level: x.level, subject: x.subject, minimumGrade: x.minimumGrade, requiredSeries: x.requiredSeries, requiredBackground: x.requiredBackground, minimumAge: x.minimumAge, maximumAge: x.maximumAge, isMandatory: x.isMandatory }))) },
            };
            const config = configs[page];
            if (!config) { res.status(404).render("errors/404"); return; }
            if (page === "sessions") {
                const selectedOpportunityId = String(req.query.opportunity || "");
                const opportunityField = config.fields.find((field) => field.name === "admissionOpportunity");
                if (opportunityField?.options?.some((option) => option.value === selectedOpportunityId)) {
                    opportunityField.selectedValue = selectedOpportunityId;
                }
            }
            res.render(`admin/${page === "sessions" ? "application-sessions" : page}`, { active: page, page, ...config });
        } catch (error) { next(error); }
    }

    async account(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.findById(req.session.userId).select("name email role createdAt").lean();
            res.render("admin/account", { active: "account", user, updated: req.query.updated === "1" });
        } catch (error) { next(error); }
    }

    async editAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.findById(req.session.userId).select("name email role").lean();
            if (!user) { res.status(404).render("errors/404"); return; }
            res.render("admin/account-edit", { active: "account", user, error: null });
        } catch (error) { next(error); }
    }

    async updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        const parsed = updateAdminAccountSchema.safeParse(req.body);
        const values = { name: req.body.name, email: req.body.email };
        if (!parsed.success) {
            res.status(400).render("admin/account-edit", {
                active: "account", user: values, error: parsed.error.issues[0]?.message,
            });
            return;
        }

        try {
            const { name, email, password } = parsed.data;
            const updates = { name, email: email.toLowerCase(), ...(password ? { password } : {}) };
            const user = await UserService.updateUser(req.session.userId!, updates);
            if (!user) { res.status(404).render("errors/404"); return; }
            res.redirect("/admin/account?updated=1");
        } catch (error) {
            const duplicateEmail = typeof error === "object" && error !== null && "code" in error && error.code === 11000;
            if (duplicateEmail) {
                res.status(409).render("admin/account-edit", {
                    active: "account", user: values, error: "That email address is already in use.",
                });
                return;
            }
            console.error("Administrator account update failed:", error);
            res.status(503).render("admin/account-edit", {
                active: "account", user: values, error: "We couldn't update your account right now. Please try again in a few minutes.",
            });
        }
    }
}

export default new AdminViewController();
