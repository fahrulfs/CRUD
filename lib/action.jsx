'use server';

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const ContactSchema = z.object({
    name: z.string().min(5),
    phone: z.string().min(11)

})

export const saveContact = async (formData) => {
    if (!formData || !formData.entries) {
        return {
            Error: "Invalid form data"
        }
    }

    const validatedFields = ContactSchema.safeParse(Object.fromEntries(formData.entries()))
    if (!validatedFields.success) {
        return {
            Error: validatedFields.error.flatten().fieldErrors
        }
    }

    try {
        await prisma.contact.create({
            data: {
                name: validatedFields.data.name,
                phone: validatedFields.data.phone
            }
        })
        return { message: "Contact saved successfully" }
    } catch (error) {
        return {
            Error: error.message
        }
    }
}
