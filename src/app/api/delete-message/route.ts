import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    dbConnect()
    try {
        const { messageId } = await request.json()
        console.log("messageId to delete", messageId);

        // FIND USER using messagId
        const user = await UserModel.findOne({ 'messages._id': messageId })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Can't Find User"
                },
                { status: 404 }
            )
        }

        // remove messages
        user.messages.map((m,i) => {
            console.log(m._id);
        })
        user.messages = user.messages.filter(message => message._id.toString() !== messageId)
        await user.save() 

        return Response.json(
            {
                success: true,
                message: "Message Deleted Successfully"
            },
            { status: 200 }
        )


    } catch (error) {
        console.error("Error Deleting Message", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error Deleting Message"
            },
            { status: 500 }
        )
    }
}