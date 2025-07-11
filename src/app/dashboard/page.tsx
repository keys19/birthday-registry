"use client";

import Link from "next/link";
import { UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { getOrCreateInviteCode, addFriendByInviteCode } from "@/lib/inviteCode";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [friendCode, setFriendCode] = useState("");
  const [status, setStatus] = useState("");
  const [myCode, setMyCode] = useState<string | null>(null);
  const [showFriends, setShowFriends] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "there");
    }
  }, [user]);

  if (loading) return <p className="p-8 text-lg">Loading...</p>;
  if (!user) return <p className="p-8 text-lg">Please sign in first.</p>;

  async function handleGenerateInvite() {
    if (!user) return;
    const code = await getOrCreateInviteCode(user.uid);
    setMyCode(code);
  }

  async function handleAddFriend() {
    if (!user) return;
    try {
      await addFriendByInviteCode(user.uid, friendCode.trim());
      setStatus("Friend added!");
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  }

  return (
    <main className="min-h-screen flex flex-col p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl md:text-5xl font-light text-brand-hotpink">
          Welcome, {name}!
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFriends(!showFriends)}
            className="p-3 bg-brand-yellow rounded-full shadow hover:bg-white transition"
          >
            <UserPlusIcon className="w-6 h-6 text-brand-hotpink" />
          </button>
          <Link
            href="/profile"
            className="p-3 bg-brand-hotpink rounded-full shadow hover:bg-brand-yellow transition"
          >
            <UserCircleIcon className="w-6 h-6 text-white" />
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-6xl mx-auto">
        {/* My Birthday Card */}
        <div className="w-full p-[2px] rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:scale-[1.03] hover:shadow-2xl transition">
          <div className="bg-white rounded-3xl p-8 h-full">
            <Link href="/my-birthday" className="no-underline">
              <h2 className="text-3xl font-light text-brand-hotpink mb-3">
                🎂 My Birthday
              </h2>
            </Link>
            <p className="text-brand-red text-lg">
              <Link href="/my-birthday" className="no-underline">
                Manage your own wishlist, add gifts, and share with friends!
              </Link>
            </p>
          </div>
        </div>

        {/* Other Birthdays Card */}
        <div className="w-full p-[2px] rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:scale-[1.03] hover:shadow-2xl transition">
          <div className="bg-white rounded-3xl p-8 h-full">
            <Link href="/other-birthdays" className="no-underline">
              <h2 className="text-3xl font-light text-brand-hotpink mb-3">
                🎁 Other Birthdays
              </h2>
            </Link>
            <p className="text-brand-red text-lg">
              <Link href="/other-birthdays" className="no-underline">
                Explore wishlists from friends, see upcoming birthdays, and plan surprises!
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Invite Code Section */}
      {showFriends && (
        <div className="max-w-lg mx-auto bg-white rounded-3xl border-4 border-brand-orange shadow-lg p-6">
          <h2 className="text-xl font-light text-brand-hotpink mb-4">Friends</h2>

          <button
            onClick={handleGenerateInvite}
            className="px-4 py-2 bg-brand-yellow text-brand-hotpink rounded-full shadow hover:bg-brand-ivory transition mb-4"
          >
            Show My Invite Code
          </button>

          {myCode && (
            <p className="mb-4 text-brand-red font-bold">
              📌 Your Invite Code: <span className="font-mono">{myCode}</span>
            </p>
          )}

          <input
            type="text"
            placeholder="Enter a friend's invite code"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            className="px-4 py-2 border rounded w-full mb-3"
          />

          <button
            onClick={handleAddFriend}
            className="px-4 py-2 bg-brand-pink text-white rounded-full shadow hover:bg-brand-hotpink transition w-full"
          >
            ➕ Add Friend
          </button>

          {status && (
            <p className="text-brand-red font-semibold mt-3">{status}</p>
          )}
        </div>
      )}
    </main>
  );
}
