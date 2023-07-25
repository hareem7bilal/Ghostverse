import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { GhostitSubscriptionValidator } from '@/lib/validators/ghostit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { ghostitId } = GhostitSubscriptionValidator.parse(body)

    // check if subscription already exists
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        ghostitId,
        userId:session.user.id

      },
    })

    if (subscriptionExists) {
      return new Response('You are already subscribed to this ghostit', { status: 400 })
    }

    // create subscription and associate it with the user

    await db.subscription.create({
      data: {
        userId: session.user.id,
        ghostitId,
      },
    })

    return new Response(ghostitId)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not subscribe, pls try again later', { status: 500 })
  }
}