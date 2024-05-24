import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";





// to update status of accepting Messages
export async function PATCH(request: Request) {
    await dbConnect();
    try {
        const {userId, isAcceptingMessages} = await request.json()
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages},
            {new: true}
        )
        if(!user){
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
export async function GET(request: Request) {
    await dbConnect();
// TODO
}