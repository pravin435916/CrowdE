import { useAuth0 } from "@auth0/auth0-react"

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <div className="text-[#FF9933]">Loading...</div>

  return isAuthenticated ? (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-sm mx-auto mt-4 border border-[#FF9933]">
      <p className="text-lg font-semibold text-[#CC6600]">{user.email}</p>
    </div>
  ) : null
}
