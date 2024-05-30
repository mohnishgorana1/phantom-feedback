import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
export async function POST(request: Request) {
    dbConnect()
    const { username, content } = await request.json()
   
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Can't Find User"
                },
                { status: 404 }
            )
        }

        // is user accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not Accepting any kind of Phantom Messages! Please Try Later!"
                },
                { status: 500 }
            )
        }

        // now user found and accepting messages
        const newMessage = { content: content[0], createdAt: new Date() }     
        user.messages.push(newMessage as Message)
        await user.save()
        console.log("Message Send Successfully!");
        return Response.json(
            {
                success: true,
                message: "Message Send Successfully!"
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Can't Send Phantom Feedback, Internal Server Error", error);
        return Response.json(
            {
                success: false,
                message: "Can't Send Phantom Feedback, Internal Server Error"
            },
            { status: 500 }
        )
    }

}