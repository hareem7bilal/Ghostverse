import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { GhostitValidator } from '@/lib/validators/ghostit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = GhostitValidator.parse(body)

    // check if subreddit already exists
    const subredditExists = await db.ghostit.findFirst({
      where: {
        name,
      },
    })

    if (subredditExists) {
      return new Response('Subreddit already exists', { status: 409 })
    }

    // create subreddit and associate it with the user
    const ghostit = await db.ghostit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: session.user.id,
        ghostitId: ghostit.id,
      },
    })

    return new Response(ghostit.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create ghostit', { status: 500 })
  }
}