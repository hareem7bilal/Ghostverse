import { getAuthSession } from '@/lib/auth'

interface pageProps {
    params: {
        slug: string
    }
}

const page = async({ params }: pageProps) => {
    const { slug } = params
    const session=await getAuthSession()



    return <div>page</div>
}

export default page