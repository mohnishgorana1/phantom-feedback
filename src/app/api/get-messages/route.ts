import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { userId } = await request.json()
        console.log("userId", userId);

        //! we can also use mongoDB aggregation pipeline
        
        // we have many user
        // match a user in all users document with matching _id 
        // that user will have messages[] itself having multiple messageDocuments 
        // so unwind messages[] them will look like, say it creates n document of same user having individual message document in it
        // after that sort all n document with createdAt: -1 field
        // now to group them all 
        // we'll group by _id and messages 
        // so user will look like
        //  user = {
        //      _id: 15616511cv2,
        //      messages: [
        //          {},
        //          {}
        //      ]
        // }   

        // const user = await UserModel.aggregate([
        //     { $match: { _id: userId } },
        //     { $unwind: '$messages' },
        //     { $sort: { 'messages.createdAt': -1 } },
        //     { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        // ])

        const user = await UserModel.findById(userId)
        console.log("user", user);

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Can't find user"
                },
                { status: 500 }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user.messages
            },
            { status: 200 }
        )


    } catch (error) {
        console.error("Failed To Fetch Messages", error);
        return Response.json(
            {
                success: false,
                message: "Failed To Fetch Messages"
            },
            { status: 500 }
        )
    }
}