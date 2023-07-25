import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import {db} from '@/lib/db'
import { notFound } from 'next/navigation'
import MiniCreatePost from '@/components/MiniCreatePost'

interface pageProps {
    params: {
        slug: string
    }
}

const page = async({ params }: pageProps) => {
    const { slug } = params
    const session=await getAuthSession()
    const ghostit=await db.ghostit.findFirst({
        where: {name: slug},
        include: {
            posts:{
                include:{
                    author:true,
                    votes:true,
                    comments:true,
                    ghostit:true
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULTS
            }
        },
      
    })

    if(!ghostit) return notFound()



    return <>
    <h1 className='font-bold text-3xl md:text-4xl h-14'>g/{ghostit.name}</h1>
    <MiniCreatePost session={session}/>
    </>
}

export default page