import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)
        
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not Found"
                },
                { status: 500 }
            )
        }
        
        
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "User verified Successfully"
                },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "User Verify Code Expires"
                },
                { status: 400 }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: "User Verify Code is Incorrect"
                },
                { status: 400 }
            )
        }

    } catch (error) {
        console.error("Error Verify user", error);
        return Response.json(
            {
                success: false,
                message: "Error Verify user"
            },
            { status: 500 }
        )
    }
}