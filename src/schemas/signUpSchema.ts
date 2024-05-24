import {z} from 'zod'

export const signUpSchema = z.object({
    username : z.
            string()
            .min(2, "Username must be at least 2 character")
            .max(20, "Username must be at less than 20 character")
            .regex(/^[a-zA-Z0-9_]+$/, "Username must not contains special Characters"),
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})