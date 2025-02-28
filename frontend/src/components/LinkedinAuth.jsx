import React, { useState, useEffect } from "react";
import axios from "axios";

const LinkedInAuth = () => {
  const CLIENT_ID = import.meta.env.VITE_LKD_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_LKD_REDIRECT_URI;
  const CLIENT_SECRET = import.meta.env.VITE_LKD_CLIENT_SECRET;
  const SCOPE = "r_liteprofile r_emailaddress"; // Skills require special permissions
  const STATE = "random_string"; // Protect against CSRF

  const [userData, setUserData] = useState(null);

  // Redirect to LinkedIn OAuth
  const handleLogin = () => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPE)}&state=${STATE}`;

    window.location.href = authUrl;
  };

  // Fetch Access Token & User Data
  const fetchUserData = async (authCode) => {
    try {
      // Step 1: Exchange Code for Access Token
      const tokenResponse = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Step 2: Fetch User Profile
      const profileResponse = await axios.get(
        "https://api.linkedin.com/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Step 3: Fetch Email
      const emailResponse = await axios.get(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setUserData({
        name: `${profileResponse.data.localizedFirstName} ${profileResponse.data.localizedLastName}`,
        email: emailResponse.data.elements[0]["handle~"].emailAddress,
      });
    } catch (error) {
      console.error("Error fetching LinkedIn data:", error);
    }
  };

  // Check if OAuth code is present in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) fetchUserData(code);
  }, []);

  return (
    <div>
      {!userData ? (
        <button onClick={handleLogin}>Login with LinkedIn</button>
      ) : (
        <div>
          <h2>Welcome, {userData.name}!</h2>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default LinkedInAuth;
