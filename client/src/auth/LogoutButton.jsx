import { useAuth0 } from "@auth0/auth0-react"

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth0()

  return isAuthenticated && (
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      className="bg-[#FF9933] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-[#CC6600] transition-all duration-300"
    >
      Logout
    </button>
  )
}
