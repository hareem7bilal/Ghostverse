import { z } from "zod"

export const GhostitValidator = z.object({
    name: z.string().min(3).max(21)
})

export const GhostitSubscriptionValidator = z.object({
    ghostitId: z.string()
})

export type CreateGhostitPayload=z.infer<typeof GhostitValidator>
export type GhostitSubscriptionPayload=z.infer<typeof GhostitSubscriptionValidator>