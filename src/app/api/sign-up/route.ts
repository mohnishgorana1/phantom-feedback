import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from '@/lib/dbConnect'
import UserModel from "@/model/User";
import bcryptjs from 'bcryptjs'


export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username Already Taken"
            })
        }


        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail?.isVerified) {
                // user exist and verified,
                return Response.json({
                    success: false,
                    message: "User Already Exists With this Email"
                }, { status: 400 })

            }
            else {
                const hashedPassword = await bcryptjs.hash(password, 10)

                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        } else {
            // register new user
            const hashedPassword = await bcryptjs.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save();



            // user registered now please send verification email
            const emailResponse = await sendVerificationEmail(email, username, verifyCode)
            console.log("emailREsponse after new registration ", emailResponse);
            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message
                }, { status: 500 })
            }

            return Response.json({
                success: true,
                message: "User Registered Successfully! Please Verify your Email"
            }, { status: 201 })

        }

    } catch (error) {
        console.log("Error Registration", error);

        return Response.json(
            {
                success: false,
                message: "Error Registering User"
            },
            { status: 500 }
        )
    }
}