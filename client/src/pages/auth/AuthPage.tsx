import { useParams } from "react-router-dom"
import { AuthView } from "@daveyplate/better-auth-ui"

export default function AuthPage() {
  const { pathname } = useParams()

  return (
    <main className="p-6 flex flex-col justify-center items-center h-[80vh]">
      <AuthView pathname={pathname} classNames={{base: 'bg-[#071a46]/70 border border-blue-200/20 text-blue-50'}}/>
    </main>
  )
}
