import { IStudentProfile } from "../models/studentProfileModel";
import RequirementService from "./requirementService";

const ageOnDate = (dateOfBirth: Date, today = new Date()): number => {
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = today.getMonth() - dateOfBirth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) age--;
    return age;
};

class EligibilityService {
    async checkEligibility(studentProfile: IStudentProfile, applicationSessionId: string) {
        const requirements = await RequirementService.getRequirementsByApplicationSession(applicationSessionId);
        const passedRequirements: string[] = [];
        const failedRequirements: string[] = [];

        if (!requirements.length) {
            return { eligible: null, passedRequirements, failedRequirements, message: "No eligibility requirements have been added for this session yet." };
        }

        const sectionRequirements = requirements.filter((requirement) => Boolean(requirement.requiredBackground));
        const commonRequirements = requirements.filter((requirement) => !requirement.requiredBackground);
        const matchingSectionRequirements = sectionRequirements.filter(
            (requirement) => requirement.requiredBackground === studentProfile.background
        );

        if (sectionRequirements.length && !matchingSectionRequirements.length) {
            return {
                eligible: null,
                passedRequirements,
                failedRequirements,
                message: `Requirements for the ${studentProfile.background} section have not been added yet.`,
            };
        }

        const applicableRequirements = [...commonRequirements, ...matchingSectionRequirements];

        for (const requirement of applicableRequirements) {
            const requirementType = requirement.type.toLowerCase();

            if (requirementType === "background" && requirement.requiredBackground) {
                passedRequirements.push(`Educational background: ${requirement.requiredBackground} section.`);
            }

            if (requirementType === "series" && requirement.requiredSeries) {
                const acceptedSeries = requirement.requiredSeries.split(",").map((series) => series.trim().toLowerCase()).filter(Boolean);
                const studentSeries = studentProfile.aLevelSeries?.trim().toLowerCase();
                if (!studentSeries || !acceptedSeries.includes(studentSeries)) {
                    if (requirement.isMandatory) failedRequirements.push(`Required A-Level series: ${acceptedSeries.join(" or ")}.`);
                } else {
                    passedRequirements.push(`A-Level series requirement passed (${studentProfile.aLevelSeries}).`);
                }
            }

            if (requirementType === "subject" && requirement.subject && requirement.minimumGrade) {
                const results = requirement.level === "o_level" ? studentProfile.oLevelResults : studentProfile.aLevelResults;
                const result = results?.find((item) => item.subject.trim().toLowerCase() === requirement.subject?.trim().toLowerCase());
                if (!result) {
                    if (requirement.isMandatory) failedRequirements.push(`${requirement.subject} is required at ${requirement.level === "o_level" ? "O-Level" : "A-Level"}.`);
                } else {
                    const gradeRank: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
                    const studentGrade = gradeRank[result.grade.trim().toUpperCase()];
                    const requiredGrade = gradeRank[requirement.minimumGrade.trim().toUpperCase()];
                    if (studentGrade === undefined || requiredGrade === undefined || studentGrade < requiredGrade) {
                        if (requirement.isMandatory) failedRequirements.push(`${requirement.subject} requires a minimum grade of ${requirement.minimumGrade} at ${requirement.level === "o_level" ? "O-Level" : "A-Level"}.`);
                    } else {
                        passedRequirements.push(`${requirement.subject} requirement passed at ${requirement.level === "o_level" ? "O-Level" : "A-Level"}.`);
                    }
                }
            }

            if (requirement.minimumAge !== undefined || requirement.maximumAge !== undefined) {
                if (!studentProfile.dateOfBirth) {
                    if (requirement.isMandatory) failedRequirements.push("Date of birth is required to check the age requirement.");
                } else {
                    const age = ageOnDate(new Date(studentProfile.dateOfBirth));
                    if (requirement.minimumAge !== undefined && age < requirement.minimumAge) {
                        if (requirement.isMandatory) failedRequirements.push(`Minimum age required is ${requirement.minimumAge}.`);
                    } else if (requirement.minimumAge !== undefined) {
                        passedRequirements.push("Minimum age requirement passed.");
                    }
                    if (requirement.maximumAge !== undefined && age > requirement.maximumAge) {
                        if (requirement.isMandatory) failedRequirements.push(`Maximum age allowed is ${requirement.maximumAge}.`);
                    } else if (requirement.maximumAge !== undefined) {
                        passedRequirements.push("Maximum age requirement passed.");
                    }
                }
            }
        }

        return { eligible: failedRequirements.length === 0, passedRequirements, failedRequirements };
    }
}

export default new EligibilityService();
