import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Home</h1>
      <p>Welcome to the app 👋</p>

      {/* Option 1: navigate with a link */}
      <p>
        <Link to="/profile">Go to Profile (via Link)</Link>
      </p>

      {/* Option 2: navigate with a button click */}
      <button onClick={goToProfile}>
        Go to Profile (via navigate)
      </button>
    </div>
  );
}

export default Home;