import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import StudentProfileService from "../services/studentProfileService";

const values = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map((item) => String(item ?? ""));
    return value === undefined || value === null ? [] : [String(value)];
};

const buildProfileData = (body: Request["body"], userId: string) => {
    const resultRows = (subjects: unknown, grades: unknown, label: string) => {
        const subjectValues = values(subjects);
        const gradeValues = values(grades);
        const rows = subjectValues.map((subject, index) => ({
            subject: subject.trim(),
            grade: (gradeValues[index] ?? "").trim(),
        })).filter((row) => row.subject || row.grade);
        if (rows.some((row) => !row.subject || !row.grade)) {
            throw new Error(`Each ${label} result must have both a subject and a grade.`);
        }
        return rows;
    };

    const year = (value: unknown) => value ? Number(value) : null;
    return {
        user: new mongoose.Types.ObjectId(userId),
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        background: body.background,
        academicStatus: body.academicStatus,
        oLevelYear: year(body.oLevelYear),
        oLevelResults: resultRows(body.oLevelSubject, body.oLevelGrade, "O-Level"),
        aLevelYear: year(body.aLevelYear),
        aLevelSeries: body.aLevelSeries || "",
        aLevelResults: resultRows(body.aLevelSubject, body.aLevelGrade, "A-Level"),
        otherQualifications: body.qualificationName ? [{
            name: String(body.qualificationName).trim(),
            year: year(body.qualificationYear),
            details: body.qualificationDetails || "",
        }] : [],
    };
};

class StudentProfileViewController {

    // Display the student's profile page
    async showProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.session.userId!;

            const profile =
                await StudentProfileService.getStudentProfileByUserId(
                    userId
                );

            res.render("student/profile", {
                profile
            });

        } catch (error) {
            next(error);
        }
    }

    // Display the create profile page
    async showCreateProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const profile = await StudentProfileService.getStudentProfileByUserId(req.session.userId!);
            if (profile) { res.redirect("/student/profile"); return; }
            res.render("student/create-profile", { profile: null, isEdit: false });
        } catch (error) {
            next(error);
        }
    }

    async showEditProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const profile = await StudentProfileService.getStudentProfileByUserId(req.session.userId!);
            if (!profile) { res.redirect("/student/profile/create"); return; }
            res.render("student/create-profile", { profile, isEdit: true });
        } catch (error) {
            next(error);
        }
    }

    // Process the create profile form
    async createProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.session.userId!;


            // Check whether the student already has a profile
            const existingProfile =
                await StudentProfileService.getStudentProfileByUserId(
                    userId
                );

            if (existingProfile) {
                res.redirect("/student/profile");
                return;
            }

            const profileData = buildProfileData(req.body, userId);

            // Save the profile
            await StudentProfileService.createStudentProfile(
                profileData
            );

            // Return to the profile page
            res.redirect("/student/profile");
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.session.userId!;
            const profile = await StudentProfileService.getStudentProfileByUserId(userId);
            if (!profile) { res.redirect("/student/profile/create"); return; }
            await StudentProfileService.updateStudentProfile(profile._id.toString(), buildProfileData(req.body, userId));
            res.redirect("/student/profile");
        } catch (error) {
            next(error);
        }
    }
}

export default new StudentProfileViewController();
