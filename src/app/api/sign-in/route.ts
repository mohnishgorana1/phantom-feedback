import { generateToken } from "@/helpers/jwt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from '@/lib/dbConnect'
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { setCookie } from 'cookies-next';


export async function POST(request: Request) {
    dbConnect()
    try {
        const { identifier, password } = await request.json()
        if (!identifier || !password) {
            return Response.json({
                success: false,
                message: "Identifier and password are required"
            }, { status: 500 });
        }

        // check user exists
        const user = await UserModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        }).select("+password")

        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found with this email/username"
            });
        }
        if (!user.isVerified) {
            return Response.json({
                success: false,
                message: "Please Verify Your Account before Login"
            }, { status: 500 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return Response.json({
                success: false,
                message: "Incorrect Credentials"
            }, { status: 500 });
        }
        const userId = user?._id
        const token = generateToken(userId)
        if (token) {
            console.log("Token Generated:: ", token);
        }
        else {
            return Response.json({
                success: false,
                message: "Credentials are right but cant generate token"
            }, { status: 500 });
        }

        return Response.json(
            {
                success: true,
                message: "Login Successful",
                token,
                user: {
                    id: userId,
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified,
                    isAcceptingMessages: user.isAcceptingMessages,
                }
            },
            { status: 200 }
        );

        
    } catch (error) {
        console.log("Error Sign In", error);

        return Response.json(
            {
                success: false,
                message: "Error Sign-In",
            },
            { status: 500 }
        )
    }
}