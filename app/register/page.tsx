import RegisterPage from "./RegisterPage";
import { Suspense } from "react";

export const metadata = {
  title: "Registration",
};

export default function Register() {
  return (
    <Suspense fallback={<div className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center flex items-center justify-center text-white">Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}
