import { IStudentProfile } from "../models/studentProfileModel";
import RequirementService from "./requirementService";

class EligibilityService {

    async checkEligibility(
        studentProfile: IStudentProfile,
        applicationSessionId: string
    ) {
        const requirements =
            await RequirementService.getRequirementsByApplicationSession(
                applicationSessionId
            );

        const failedRequirements: string[] = [];
        const passedRequirements: string[] = [];

        for (const requirement of requirements) {

            // Check educational background
            if (
                requirement.requiredBackground &&
                studentProfile.background
            ) {
                if (
                    studentProfile.background !==
                    requirement.requiredBackground
                ) {
                    if (requirement.isMandatory) {
                        failedRequirements.push(
                            `Required educational background is ${requirement.requiredBackground}.`
                        );
                    }
                } else {
                    passedRequirements.push(
                        `Educational background requirement passed.`
                    );
                }
            }

            // Check A-Level series
            if (
                requirement.type.toLowerCase() === "series" &&
                requirement.requiredSeries
            ) {
                if (
                    studentProfile.aLevelSeries?.toLowerCase() !==
                    requirement.requiredSeries.toLowerCase()
                ) {
                    if (requirement.isMandatory) {
                        failedRequirements.push(
                            `Required A-Level series is ${requirement.requiredSeries}.`
                        );
                    }
                } else {
                    passedRequirements.push(
                        `A-Level series requirement passed.`
                    );
                }
            }

            // Check subject and minimum grade
            if (
                requirement.type.toLowerCase() === "subject" &&
                requirement.subject &&
                requirement.minimumGrade
            ) {

                const results =
                    requirement.level === "o_level"
                        ? studentProfile.oLevelResults
                        : studentProfile.aLevelResults;

                const result = results?.find(
                    (result) =>
                        result.subject.toLowerCase() ===
                        requirement.subject?.toLowerCase()
                );

                // Student does not have the required subject
                if (!result) {
                    if (requirement.isMandatory) {
                        failedRequirements.push(
                            `${requirement.subject} is required at ${requirement.level === "o_level" ? "O-Level" : "A-Level"}.`
                        );
                    }
                } else {

                    const gradeRank: Record<string, number> = {
                        A: 5,
                        B: 4,
                        C: 3,
                        D: 2,
                        E: 1,
                        F: 0,
                    };

                    const studentGrade =
                        gradeRank[result.grade.toUpperCase()];

                    const requiredGrade =
                        gradeRank[
                            requirement.minimumGrade.toUpperCase()
                        ];

                    if (
                        studentGrade === undefined ||
                        requiredGrade === undefined ||
                        studentGrade < requiredGrade
                    ) {
                        if (requirement.isMandatory) {
                            failedRequirements.push(
                                `${requirement.subject} requires a minimum grade of ${requirement.minimumGrade} at ${requirement.level === "o_level" ? "O-Level" : "A-Level"}.`
                            );
                        }
                    } else {
                        passedRequirements.push(
                            `${requirement.subject} requirement passed at ${requirement.level === "o_level" ? "O-Level" : "A-Level"}.`
                        );
                    }
                }
            }

            // Check minimum age
            if (requirement.minimumAge !== undefined) {

                if (!studentProfile.dateOfBirth) {

                    if (requirement.isMandatory) {
                        failedRequirements.push(
                            "Date of birth is required to check the minimum age."
                        );
                    }

                } else {

                    const today = new Date();

                    const birthDate = new Date(
                        studentProfile.dateOfBirth
                    );

                    let age =
                        today.getFullYear() -
                        birthDate.getFullYear();

                    const monthDifference =
                        today.getMonth() -
                        birthDate.getMonth();

                    if (
                        monthDifference < 0 ||
                        (
                            monthDifference === 0 &&
                            today.getDate() < birthDate.getDate()
                        )
                    ) {
                        age--;
                    }

                    if (age < requirement.minimumAge) {

                        if (requirement.isMandatory) {
                            failedRequirements.push(
                                `Minimum age required is ${requirement.minimumAge}.`
                            );
                        }

                    } else {
                        passedRequirements.push(
                            `Minimum age requirement passed.`
                        );
                    }
                }
            }

            // Check maximum age
            if (requirement.maximumAge !== undefined) {

                if (!studentProfile.dateOfBirth) {

                    if (requirement.isMandatory) {
                        failedRequirements.push(
                            "Date of birth is required to check the maximum age."
                        );
                    }

                } else {

                    const today = new Date();

                    const birthDate = new Date(
                        studentProfile.dateOfBirth
                    );

                    let age =
                        today.getFullYear() -
                        birthDate.getFullYear();

                    const monthDifference =
                        today.getMonth() -
                        birthDate.getMonth();

                    if (
                        monthDifference < 0 ||
                        (
                            monthDifference === 0 &&
                            today.getDate() < birthDate.getDate()
                        )
                    ) {
                        age--;
                    }

                    if (age > requirement.maximumAge) {

                        if (requirement.isMandatory) {
                            failedRequirements.push(
                                `Maximum age allowed is ${requirement.maximumAge}.`
                            );
                        }

                    } else {
                        passedRequirements.push(
                            `Maximum age requirement passed.`
                        );
                    }
                }
            }
        }

        return {
            eligible: failedRequirements.length === 0,
            passedRequirements,
            failedRequirements,
        };
    }
}

export default new EligibilityService();