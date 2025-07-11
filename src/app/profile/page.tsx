// "use client";

// import { useState, useEffect } from "react";
// import { auth, db } from "@/lib/firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import Link from "next/link";
// import { getOrCreateInviteCode } from "@/lib/inviteCode";

// export default function ProfilePage() {
//   const [userId, setUserId] = useState<string | null>(null);
//   const [name, setName] = useState("");
//   const [birthday, setBirthday] = useState("");
//   const [interests, setInterests] = useState("");
//   const [inviteCode, setInviteCode] = useState<string | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setUserId(user.uid);
//         const userRef = doc(db, "users", user.uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           const data = userSnap.data();
//           setName(data.name || "");
//           setBirthday(data.birthday || "");
//           setInterests(data.interests || "");
//           const code = await getOrCreateInviteCode(user.uid);
//           setInviteCode(code);
//         }
//       } else {
//         setUserId(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSave = async () => {
//     if (!userId) {
//       alert("Please sign in first.");
//       return;
//     }

//     try {
//       const userRef = doc(db, "users", userId);
//       await setDoc(
//         userRef,
//         { name, birthday, interests },
//         { merge: true }
//       );
//       alert("✅ Preferences saved!");
//     } catch (error) {
//       console.error("Error saving:", error);
//       alert("❌ Failed to save.");
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fffef8]">
//       <div className="w-full max-w-md mb-4">
//         <Link
//           href="/dashboard"
//           className="inline-block mb-4 text-brand-hotpink hover:underline"
//         >
//           ← Back to Dashboard
//         </Link>
//       </div>

//       <div className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8 border border-brand-yellow">
//         <h1 className="text-3xl mb-6 text-center text-brand-hotpink">
//           Profile
//         </h1>

//         <div className="mb-6">
//           <label className="block mb-2 text-sm font-medium text-brand-hotpink">
//             Your Name
//           </label>
//           <input
//             type="text"
//             placeholder="e.g., John Doe"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block mb-2 text-sm font-medium text-brand-hotpink">
//             Your Birthday
//           </label>
//           <input
//             type="date"
//             value={birthday}
//             onChange={(e) => setBirthday(e.target.value)}
//             className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block mb-2 text-sm font-medium text-brand-hotpink">
//             Interests / Tags (comma-separated)
//           </label>
//           <input
//             type="text"
//             placeholder="e.g., Tech, Books, Travel"
//             value={interests}
//             onChange={(e) => setInterests(e.target.value)}
//             className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
//           />
//         </div>

//         <button
//           onClick={handleSave}
//           className="w-full bg-brand-hotpink text-white py-3 rounded-xl font-semibold hover:bg-brand-yellow hover:text-brand-hotpink transition"
//         >
//           Save Changes
//         </button>

//         {inviteCode && (
//           <p className="mt-4 text-center text-brand-hotpink font-semibold">
//             Your Invite Code:{" "}
//             <span className="text-gray-800 font-mono">{inviteCode}</span>
//           </p>
//         )}
//       </div>
//     </main>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { getOrCreateInviteCode } from "@/lib/inviteCode";

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [interests, setInterests] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setName(data.name || "");
          setBirthday(data.birthday || "");
          setInterests(data.interests || "");
          const code = await getOrCreateInviteCode(user.uid);
          setInviteCode(code);
        }
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      alert("Please sign in first.");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        { name, birthday, interests },
        { merge: true }
      );
      // alert("✅ Preferences saved!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("❌ Failed to save.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // alert("✅ Signed out!");
      window.location.href = "/"; // Optional: redirect to home or sign-in page
    } catch (error) {
      console.error("Error signing out:", error);
      alert("❌ Failed to sign out.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fffef8]">
      <div className="w-full max-w-md mb-4">
        <Link
          href="/dashboard"
          className="inline-block mb-4 text-brand-hotpink hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8 border border-brand-yellow">
        <h1 className="text-3xl mb-6 text-center text-brand-hotpink">
          Profile
        </h1>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-brand-hotpink">
            Your Name
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-brand-hotpink">
            Your Birthday
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-brand-hotpink">
            Interests / Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g., Tech, Books, Travel"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-brand-hotpink text-white py-3 rounded-xl font-semibold hover:bg-brand-yellow hover:text-brand-hotpink transition"
        >
          Save Changes
        </button>

        {inviteCode && (
          <p className="mt-4 text-center text-brand-hotpink font-semibold">
            Your Invite Code:{" "}
            <span className="text-gray-800 font-mono">{inviteCode}</span>
          </p>
        )}

        <button
          onClick={handleSignOut}
          className="w-full mt-6 bg-brand-blush text-brand-hotpink py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
