import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Profile</h1>
      <p>Your details will be shown here</p>

      {/* Option 1: navigate with a link */}
      <p>
        <Link to="/">Go to Home Page (via Link)</Link>
      </p>

      {/* Option 2: navigate with a button click */}
      <button onClick={goToHome}>
        Go to Home Page (via navigate)
      </button>
    </div>
  );
}

export default Profile;