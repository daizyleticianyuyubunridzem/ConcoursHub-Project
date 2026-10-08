import nodemailer from "nodemailer";

class EmailService {
    private getTransport() {
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
        if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !process.env.SMTP_FROM) {
            throw new Error("Password reset email is not configured.");
        }

        return nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
        });
    }

    async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
        const transport = this.getTransport();
        await transport.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Reset your Concours Hub password",
            text: `Use this link to reset your password. It expires in 30 minutes:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
            html: `<p>Use the link below to reset your Concours Hub password. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset my password</a></p><p>If you did not request this, you can ignore this email.</p>`,
        });
    }
}

export default new EmailService();
