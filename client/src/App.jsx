import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";

export default function App() {
  const { isLoading } = useAuth0();

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bhagva/10 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-bhagva mb-8">
          Secure Authentication
        </h1>

        <div className="flex gap-4 justify-center mb-8">
          <LoginButton />
          <LogoutButton />
        </div>

        <Profile />
      </div>
    </div>
  );
}
