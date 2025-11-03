"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router=useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result=await signIn("credentials",{
        email,
        password,
        redirect:false,
    });
    if(result?.error){
    setError("Invalid Credentials! Please sign up first");
     }
    else{
     router.push("/Dashboard");
      }
};
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 rounded"
        />
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <button className="bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>

      <p className="text-center mt-3 text-sm">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
