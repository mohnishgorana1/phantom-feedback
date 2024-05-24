import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        const res = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Phantom Message Email Verification Code',
            react: VerificationEmail({username, otp: verifyCode})
        });
        console.log("res",res);
        

        return { success: true, message: "Verification Email Send Successfully" }

    } catch (emailError) {
        console.log("Error Sending Verification Email", emailError);
        return { success: false, message: "Failed To send Verification Email" }
    }
}
