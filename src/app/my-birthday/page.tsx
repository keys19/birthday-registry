"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function MyBirthdayPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<{ name: string; link: string }[]>([
    { name: "", link: "" },
  ]);
  const [isSaved, setIsSaved] = useState(false); // ✅ new state for feedback

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.wishlist) setWishlist(data.wishlist);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const addItem = () => {
    setWishlist([...wishlist, { name: "", link: "" }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...wishlist];
    updated[index] = { ...updated[index], [field]: value };
    setWishlist(updated);
  };

  const saveWishlist = async () => {
    if (!userId) {
      alert("Please sign in.");
      return;
    }
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { wishlist }, { merge: true });

    setIsSaved(true); // ✅ show feedback
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const deleteItem = async (index: number) => {
    const updated = wishlist.filter((_, i) => i !== index);
    setWishlist(updated);

    if (userId) {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { wishlist: updated }, { merge: true });
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F8F4]">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-brand-hotpink mb-4">
          🎂 My Birthday List
        </h1>

        <Link
          href="/dashboard"
          className="inline-block text-brand-hotpink hover:underline mb-6"
        >
          ← Back to Dashboard
        </Link>

        {wishlist.map((item, index) => (
          <div key={index} className="mb-4 relative">
            <input
              type="text"
              placeholder="Gift name"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              className="w-full mb-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <input
              type="url"
              placeholder="Link (optional)"
              value={item.link}
              onChange={(e) => updateItem(index, "link", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              onClick={() => deleteItem(index)}
              className="absolute top-0 right-0 mt-2 mr-2 text-pink-500 hover:text-pink-700 text-xl font-bold"
              title="Delete this item"
            >
              ✖
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full bg-pink-200 text-brand-hotpink font-semibold py-3 rounded-lg shadow hover:bg-pink-300 transition mb-4"
        >
          ➕ Add Another Item
        </button>

        <button
          onClick={saveWishlist}
          className="w-full bg-brand-hotpink text-white font-semibold py-3 rounded-lg shadow hover:bg-pink-600 transition"
        >
          {isSaved ? "🤍 Saved!" : "🤍 Save Wishlist"}
        </button>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-brand-hotpink mb-2">
            Your Wishlist:
          </h2>
          <div className="space-y-3">
            {wishlist.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-pink-50 border border-pink-200 rounded-xl p-3"
              >
                <span className="text-gray-800 font-medium">
                  🎁 {item.name}
                </span>
                <div className="flex items-center gap-3">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-hotpink underline"
                    >
                      Link
                    </a>
                  )}
                  <button
                    onClick={() => deleteItem(index)}
                    className="text-pink-500 hover:text-pink-700 text-lg font-bold"
                    title="Delete this item"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
