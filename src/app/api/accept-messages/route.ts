import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";





// to update status of accepting Messages
export async function PATCH(request: Request) {
    await dbConnect();
    try {
        const { userId, isAcceptingMessages } = await request.json()
        console.log("userId", userId);
        console.log("isAcceptingMessages", isAcceptingMessages);
        
        
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages },
            { new: true }
        )
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found to update isAccepting Messages"
                },
                { status: 500 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "isAcceptingMessages status updated successfully"
            },
            { status: 200 }
        )



    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error updating status of isAccepting Messages"
            },
            { status: 500 }
        )
    }
}



// to check the status of accepting messages
export async function POST(request: Request) {
    await dbConnect();
    try {
        const { userId } = await request.json()
        console.log("userId", userId);
        const foundUser = await UserModel.findById(userId)
        console.log("found User", foundUser);
        
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "",
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Failed To Fetch Status of Accepting Messages of Requested User", error);
        return Response.json(
            {
                success: false,
                message: "Failed To Fetch Status of Accepting Messages of Requested User"
            },
            { status: 500 }
        )
    }
}