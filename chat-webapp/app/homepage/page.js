"use client";

import withAuth from "@/hoc/withAuth";
import { handleGoogleSignout } from "@/actions/user.actions";

const Homepage = () => {
  return (
    <div>
      <h1>Welcome to the homepage!</h1>
      <button onClick={handleGoogleSignout}>Sign out</button>
    </div>
  );
};

export default withAuth(Homepage);
