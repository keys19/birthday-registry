"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Redirecting...</p>
    </main>
  );
}
