import LoginPage from "./LoginPage";
import { Suspense } from "react";

export const metadata = {
  title: "Log In",
};

export default function Login() {
  return (
    <Suspense fallback={<div className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center flex items-center justify-center text-white">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
