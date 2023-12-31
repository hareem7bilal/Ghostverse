import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"
import { notFound } from 'next/navigation'
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle"
import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"


const Layout = async ({
    children,
    params: { slug },
}: {
    children: React.ReactNode,
    params: { slug: string }
}

) => {

    const session = await getAuthSession()

    const ghostit = await db.ghostit.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                }
            }
        },

    })

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
        where: {
            ghostit: {
                name: slug,
            },
            user: {
                id: session.user.id,
            }
        }
    })

    const isSubscribed = !!subscription
    if (!ghostit) return notFound()

    const memberCount = await db.subscription.count({
        where: {
            ghostit: {
                name: slug,
            }
        }
    })





    return <div className="sm:container max-w-7xl mx-auto h-full pt-12">
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                <div className="flex flex-col col-span-2 space-y-6"> {children}</div>
                <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                    <div className="px-6 py-4">
                        <p className="font-semibold py-3">About g/{ghostit.name}</p>
                    </div>
                    <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
                        <div className="flex justify-between gap-x-4 py-3">
                            <dd className="text-gray-500">Created</dd>
                            <dd className="text-gray-700">
                                <time dateTime={ghostit.createdAt.toDateString()}>
                                    {format(ghostit.createdAt, 'MMMM d, yyyy')}</time>
                            </dd>
                        </div>

                        <div className="flex justify-between gap-x-4 py-3">
                            <dd className="text-gray-500">Members</dd>
                            <dd className="text-gray-900">
                                {memberCount}
                            </dd>
                        </div>

                        {ghostit.creatorId === session?.user.id ? (
                            <div className="flex justify-between gap-x-4 py-3">
                                <dd className="text-gray-500">You created this community</dd>
                            </div>
                        ) : null}

                        {ghostit.creatorId !== session?.user.id?(
                            <SubscribeLeaveToggle ghostitId={ghostit.id} ghostitName={ghostit.name} isSubscribed={isSubscribed}/>
                        ):null}

                        <Link 
                        className={buttonVariants({variant:'outline', className:'w-full mb-6'})}
                        href={`http://localhost:3000/g/${slug}/submit`}>Create Post</Link>

                    </dl>
                </div>
            </div>
        </div>
    </div>

}

export default Layout