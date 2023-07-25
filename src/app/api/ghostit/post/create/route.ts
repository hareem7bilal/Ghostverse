import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { ghostitId, title, content} = PostValidator.parse(body)

    // check if subscription already exists
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        ghostitId,
        userId:session.user.id

      },
    })

    if (!subscriptionExists) {
      return new Response('Subscribe to post', { status: 400 })
    }

    // create post and associate it with the user

    await db.post.create({
      data: {
        title,
        content,
        authorId:session.user.id,
        ghostitId,
      },
    })

    return new Response('ok', { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not post to ghostit at this time, pls try again later', { status: 500 })
  }
}