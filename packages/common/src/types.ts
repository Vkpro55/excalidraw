import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string()
});

export const SigninBodySchema = z.object({
    email: z.string(),
    password: z.string()
});

export const CreateRoomSchema = z.object({
    name: z.string()
});