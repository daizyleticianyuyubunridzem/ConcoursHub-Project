import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import StudentProfileService from "../services/studentProfileService";
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
            res.render("student/create-profile");
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

            const {
                dateOfBirth,
                background,
                academicStatus,

                oLevelYear,
                oLevelSubject,
                oLevelGrade,

                aLevelYear,
                aLevelSeries,
                aLevelSubject,
                aLevelGrade,

                qualificationName,
                qualificationYear,
                qualificationDetails
            } = req.body;


            // Check whether the student already has a profile
            const existingProfile =
                await StudentProfileService.getStudentProfileByUserId(
                    userId
                );

            if (existingProfile) {
                res.redirect("/student/profile");
                return;
            }

            // Convert O-Level values into arrays
            const oLevelSubjects =
                Array.isArray(oLevelSubject)
                    ? oLevelSubject
                    : oLevelSubject
                        ? [oLevelSubject]
                        : [];

            const oLevelGrades =
                Array.isArray(oLevelGrade)
                    ? oLevelGrade
                    : oLevelGrade
                        ? [oLevelGrade]
                        : [];


            // Create O-Level result objects
            const oLevelResults = oLevelSubjects
                .map((subject: string, index: number) => ({
                    subject: subject.trim(),
                    grade: String(
                        oLevelGrades[index] ?? ""
                    ).trim()
                }))
                .filter(
                    (result: { subject: string; grade: string }) =>
                        result.subject !== "" || result.grade !== ""
                );

                if (
                    oLevelResults.some(
                        (result: { subject: string; grade: string }) =>
                            result.subject === "" || result.grade === ""
                    )
                ) {
                    throw new Error(
                        "Each O-Level result must have both a subject and a grade."
                    );
                }


            // Convert A-Level values into arrays
            const aLevelSubjects =
                Array.isArray(aLevelSubject)
                    ? aLevelSubject
                    : aLevelSubject
                        ? [aLevelSubject]
                        : [];

            const aLevelGrades =
                Array.isArray(aLevelGrade)
                    ? aLevelGrade
                    : aLevelGrade
                        ? [aLevelGrade]
                        : [];


            // Create A-Level result objects
            const aLevelResults = aLevelSubjects
                .map((subject: string, index: number) => ({
                    subject: subject.trim(),
                    grade: String(
                        aLevelGrades[index] ?? ""
                    ).trim()
                }))
                .filter(
                    (result: { subject: string; grade: string }) =>
                        result.subject !== "" || result.grade !== ""
                );

                if (
                    aLevelResults.some(
                        (result: { subject: string; grade: string }) =>
                            result.subject === "" || result.grade === ""
                    )
                ) {
                    throw new Error(
                        "Each A-Level result must have both a subject and a grade."
                    );
                }

            // Prepare the complete student profile
            const profileData = {

                user: new mongoose.Types.ObjectId(userId),

                dateOfBirth: dateOfBirth || undefined,
                background,
                academicStatus,
                oLevelYear:
                    oLevelYear
                        ? Number(oLevelYear)
                        : undefined,

                oLevelResults,
                aLevelYear:
                    aLevelYear
                        ? Number(aLevelYear)
                        : undefined,

                aLevelSeries:
                    aLevelSeries || undefined,

                aLevelResults,

                otherQualifications:
                    qualificationName
                        ? [
                            {
                                name: qualificationName,
                                year:
                                    qualificationYear? Number(qualificationYear)
                                        : undefined,
                                details:
                                    qualificationDetails ||
                                    undefined
                            }
                        ]
                        : []
            };


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
}

export default new StudentProfileViewController();
