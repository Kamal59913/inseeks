import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'

export default function EnvCard(props) {
  const navigate = useNavigate()
  const [jointoggle, setjointoggle] = useState(false)
  /*url to join community*/
  let urltojoin = "http://localhost:8000/api/v1/env/create-user-join"

  /*useEffect hook to check whether the user has joined or not*/
  useEffect(() => {
    setjointoggle(props.isJoined)
  }, [])
  
  const onClickCard  = (name) => {
    navigate(`/env-home-page/${name}`)
  }

  const onclicking = () => {
    const data = {
        title: props.title
    }
    axios.post(urltojoin, data, {
      withCredentials: true
    })
    .then((res) => {
      jointoggle? setjointoggle(false): setjointoggle(true);
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <div class="w-[300px] rounded-md border">
            <img
              src={props.avatar || "https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png"}
              alt="Laptop"
              class="h-[200px] w-full rounded-md object-cover"
              onClick={() => onClickCard(props.title)}
            />
            <div class="px-4">
              <h1 class="mt-4 text-lg font-semibold">{props.title}</h1>
              <p class="text-sm text-slate-100">
                {props.description}
              </p>
              <div class="isolate flex-space-x-2">
              <button
                type="button"
                class="mb-4 rounded-sm bg-black px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={onclicking}
              >
                {jointoggle? <>Joined</>: <>Join</>}
              </button>  
                  <img
                    className="relative ml-14 z-30 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                    src="https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg"
                  />
                  <img
                    class="relative z-20 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                    src="https://res.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco,dpr_1/smokhfs2uevnppc2bmwl"
                  />
                  <img
                    class="relative z-10 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                    src="https://leerob.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar.b1d1472f.jpg&amp;w=256&amp;q=75"
                    alt="Lee_Robinson"
                  />
                  <img
                    class="relative z-0 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                    src="https://nextjs.org/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F35255%2F1665059775-delba.jpg&amp;w=640&amp;q=75"
                    alt="Delba"
                  />
              </div>

          </div>
        </div> 
)
}
