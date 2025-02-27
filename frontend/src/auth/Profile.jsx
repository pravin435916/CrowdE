import { useAuth0 } from "@auth0/auth0-react"

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  console.log('user: ', user);

  if (isLoading) return <div className="text-[#FF9933]">Loading...</div>

  return isAuthenticated ? (
    <div className="bg-white flex gap-2 items-center p-1 rounded-lg border border-[#FF9933]">
      {/* <p className="text-xs font-semibold text-[#CC6600]">{user.email}</p> */}
      <img className="w-8 h-8 object-cover rounded-full" src={user?.picture} alt={user.name} />
      <p className="text-xs font-semibold text-[#CC6600]">{user.name}</p>
    </div>
  ) : null
}
