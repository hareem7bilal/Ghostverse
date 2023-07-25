import axios from "axios"


export async function GET(req: Request) {
  const url=new URL(req.url)
  const href=url.searchParams.get('url')
  if(!href){
    return new Response('invalid href', {status:400})
  }
  const res=await axios.get(href)
  const titleMatch=res.data.match(/<title>(.*?)<\/title>/)
  const title=titleMatch?titleMatch[1]:''

  const descMatch=res.data.match(/<meta name="desc" content="(.*?)"/)
  const desc=descMatch?descMatch[1]:''

  const imgMatch=res.data.match(/<meta property="og:image" content="(.*?)"/)
  const imgUrl=imgMatch?imgMatch[1]:''

  return new Response(JSON.stringify({
    success:1,
    meta: {
        title,
        desc,
        img: {
            url: imgUrl
        }
    }
  }))
}