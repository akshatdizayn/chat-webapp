"use client";
import { handleGoogleSignout } from "@/actions/user.actions";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();
  return (
    <div>
      <h1>Welcome to the homepage!</h1>
      <button onClick={() => handleGoogleSignout(router)}>Sign out</button>
    </div>
  );
}
