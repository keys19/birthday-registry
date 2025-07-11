// "use client";

// import { useState, useEffect } from "react";
// import { db } from "@/lib/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import Link from "next/link";

// export default function OtherBirthdaysPage() {
//   const [users, setUsers] = useState<
//     {
//       id: string;
//       birthday: string;
//       wishlist: any[];
//       name?: string;
//       expanded: boolean;
//     }[]
//   >([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const querySnapshot = await getDocs(collection(db, "users"));
//       const userList: any[] = [];
//       querySnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         userList.push({
//           id: docSnap.id,
//           name: data.name || "Unnamed",
//           birthday: data.birthday || "Not set",
//           wishlist: data.wishlist || [],
//           expanded: false,
//         });
//       });
//       setUsers(userList);
//     };

//     fetchUsers();
//   }, []);

//   const toggleExpand = (index: number) => {
//     const updated = [...users];
//     updated[index].expanded = !updated[index].expanded;
//     setUsers(updated);
//   };

//   const formatBirthday = (birthdayStr: string) => {
//     if (birthdayStr === "Not set") return "Not set";

//     const birthdayDate = new Date(birthdayStr);
//     const day = birthdayDate.getDate();
//     const month = birthdayDate.toLocaleString("default", { month: "long" });

//     const now = new Date();
//     const thisYear = now.getFullYear();

//     let nextBirthday = new Date(thisYear, birthdayDate.getMonth(), day);
//     if (nextBirthday < now) {
//       nextBirthday = new Date(thisYear + 1, birthdayDate.getMonth(), day);
//     }

//     const diffTime = nextBirthday.getTime() - now.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     const getOrdinal = (n: number) => {
//       if (n > 3 && n < 21) return "th";
//       switch (n % 10) {
//         case 1:
//           return "st";
//         case 2:
//           return "nd";
//         case 3:
//           return "rd";
//         default:
//           return "th";
//       }
//     };

//     return `${day}${getOrdinal(day)} ${month} (in ${diffDays} days)`;
//   };

//   return (
//     <main className="min-h-screen p-8 bg-gradient-to-br from-yellow-50 to-pink-50">
//       {/* ✅ Back to Dashboard link */}
//       <div className="mb-4">
//         <Link
//           href="/dashboard"
//           className="text-purple-600 hover:underline inline-block"
//         >
//           ← Back to Dashboard
//         </Link>
//       </div>

//       <h1 className="text-4xl font-bold mb-8 text-purple-700">
//         🎉 Other Birthdays
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {users.map((user, index) => (
//           <div
//             key={user.id}
//             className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
//             onClick={() => toggleExpand(index)}
//           >
//             <h2 className="text-xl font-bold text-purple-800 mb-2">
//               {user.name}
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Birthday: {formatBirthday(user.birthday)}
//             </p>

//             {user.expanded && (
//               <ul className="list-disc pl-5">
//                 {user.wishlist.length === 0 && (
//                   <li className="text-gray-500">No wishlist added.</li>
//                 )}
//                 {user.wishlist.map((item, i) => (
//                   <li key={i}>
//                     {item.name}{" "}
//                     {item.link && (
//                       <a
//                         href={item.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline ml-1"
//                       >
//                         Link
//                       </a>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { db, auth } from "@/lib/firebase";
// import {
//   collection,
//   getDoc,
//   doc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// export default function OtherBirthdaysPage() {
//   const [users, setUsers] = useState<
//     {
//       id: string;
//       birthday: string;
//       wishlist: any[];
//       name: string;
//       expanded: boolean;
//     }[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFriendsBirthdays = async () => {
//       onAuthStateChanged(auth, async (currentUser) => {
//         if (!currentUser) {
//           setUsers([]);
//           setLoading(false);
//           return;
//         }

//         const userRef = doc(db, "users", currentUser.uid);
//         const userSnap = await getDoc(userRef);

//         if (!userSnap.exists()) {
//           setLoading(false);
//           return;
//         }

//         const data = userSnap.data();
//         const friends = data.friends || [];

//         if (friends.length === 0) {
//           setLoading(false);
//           return;
//         }

//         const friendsQuery = query(
//           collection(db, "users"),
//           where("__name__", "in", friends)
//         );

//         const snapshot = await getDocs(friendsQuery);

//         const friendList: any[] = [];
//         snapshot.forEach((docSnap) => {
//           const u = docSnap.data();
//           friendList.push({
//             id: docSnap.id,
//             name: u.name || "Unnamed",
//             birthday: u.birthday || "Not set",
//             wishlist: u.wishlist || [],
//             expanded: false,
//           });
//         });

//         setUsers(friendList);
//         setLoading(false);
//       });
//     };

//     fetchFriendsBirthdays();
//   }, []);

//   const toggleExpand = (index: number) => {
//     const updated = users.map((u, i) =>
//       i === index ? { ...u, expanded: !u.expanded } : { ...u, expanded: false }
//     );
//     setUsers(updated);
//   };

//   const formatBirthday = (birthdayStr: string) => {
//     if (birthdayStr === "Not set") return "Not set";
//     const date = new Date(birthdayStr);
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "long" });

//     const now = new Date();
//     const thisYear = now.getFullYear();
//     let next = new Date(thisYear, date.getMonth(), day);

//     if (next < now) {
//       next = new Date(thisYear + 1, date.getMonth(), day);
//     }

//     const diffDays = Math.ceil(
//       (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
//     );

//     const getOrdinal = (n: number) => {
//       if (n > 3 && n < 21) return "th";
//       switch (n % 10) {
//         case 1:
//           return "st";
//         case 2:
//           return "nd";
//         case 3:
//           return "rd";
//         default:
//           return "th";
//       }
//     };

//     return `${day}${getOrdinal(day)} ${month} (${diffDays} days left)`;
//   };

//   return (
//     <main className="min-h-screen p-8 bg-[#F9F8F4]">
//       <Link
//         href="/dashboard"
//         className="text-purple-600 hover:underline inline-block mb-4"
//       >
//         ← Back to Dashboard
//       </Link>

//       <h1 className="text-4xl font-light mb-8 text-purple-700">
//         Other Birthdays
//       </h1>

//       {loading && <p>Loading...</p>}

//       {!loading && users.length === 0 && (
//         <p className="text-gray-500">No friends added yet!</p>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {users.map((user, index) => (
//   <div
//     key={user.id}
//     onClick={() => toggleExpand(index)}
//     className="p-[2px] rounded-3xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:scale-[1.02] transition cursor-pointer"
//   >
//     <div className="bg-white rounded-3xl p-6 h-full shadow-lg">
//       <h2 className="text-2xl font-bold text-purple-700 mb-2">{user.name}</h2>

//       {user.birthday !== "Not set" ? (
//         <>
//           <p className="text-xl font-semibold text-gray-800">
//             {new Date(user.birthday).toLocaleDateString("en-US", {
//               day: "numeric",
//               month: "long",
//             })}
//           </p>
//           <p className="text-lg text-gray-500">
//             {formatBirthday(user.birthday).split("(")[1].replace(")", "")}
//           </p>
//         </>
//       ) : (
//         <p className="text-gray-500">No birthday set</p>
//       )}

//       {user.expanded && (
//         <div className="mt-4">
//           {user.wishlist.length === 0 ? (
//             <p className="text-gray-400">No wishlist yet.</p>
//           ) : (
//             <ul className="space-y-2">
//               {user.wishlist.map((item, i) => (
//                 <li
//                   key={i}
//                   className="flex justify-between items-center bg-purple-50 px-3 py-2 rounded-lg"
//                 >
//                   <span className="text-purple-800">{item.name}</span>
//                   {item.link && (
//                     <a
//                       href={item.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-purple-600 underline"
//                     >
//                       Link
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   </div>
// ))}

//       </div>
//     </main>
//   );
// }"use client";
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function OtherBirthdaysPage() {
  const [users, setUsers] = useState<
    {
      id: string;
      birthday: string;
      wishlist: any[];
      name: string;
      expanded: boolean;
    }[]
  >([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendsBirthdays = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          setUsers([]);
          setLoading(false);
          return;
        }

        setCurrentUserId(currentUser.uid);

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setLoading(false);
          return;
        }

        const data = userSnap.data();
        const friends = data.friends || [];

        if (friends.length === 0) {
          setLoading(false);
          return;
        }

        const friendsQuery = query(
          collection(db, "users"),
          where("__name__", "in", friends)
        );

        const snapshot = await getDocs(friendsQuery);

        const friendList: any[] = [];
        snapshot.forEach((docSnap) => {
          const u = docSnap.data();
          friendList.push({
            id: docSnap.id,
            name: u.name || "Unnamed",
            birthday: u.birthday || "Not set",
            wishlist: u.wishlist || [],
            expanded: false,
          });
        });

        setUsers(friendList);
        setLoading(false);
      });
    };

    fetchFriendsBirthdays();
  }, []);

  const toggleExpand = (index: number) => {
    const updated = users.map((u, i) =>
      i === index ? { ...u, expanded: !u.expanded } : { ...u, expanded: false }
    );
    setUsers(updated);
  };

  const handleReserve = async (friendId: string, itemIndex: number) => {
    if (!currentUserId) return;

    const userRef = doc(db, "users", friendId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const data = userSnap.data();
    const wishlist = data.wishlist || [];

    // If already reserved by current user -> unreserve
    if (wishlist[itemIndex].reservedBy === currentUserId) {
      wishlist[itemIndex].reservedBy = "";
    } else if (wishlist[itemIndex].reservedBy) {
      alert("This gift is already reserved by someone else!");
      return;
    } else {
      wishlist[itemIndex].reservedBy = currentUserId;
    }

    await updateDoc(userRef, { wishlist });

    const updated = users.map((u) =>
      u.id === friendId
        ? {
            ...u,
            wishlist: wishlist,
          }
        : u
    );
    setUsers(updated);
  };

  const formatBirthday = (birthdayStr: string) => {
    if (birthdayStr === "Not set") return { day: "", month: "", diffDays: "" };
    const date = new Date(birthdayStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });

    const now = new Date();
    const thisYear = now.getFullYear();
    let next = new Date(thisYear, date.getMonth(), day);

    if (next < now) {
      next = new Date(thisYear + 1, date.getMonth(), day);
    }

    const diffDays = Math.ceil(
      (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { day, month, diffDays };
  };

  return (
    <main className="min-h-screen p-8 bg-[#F9F8F4]">
      <Link
        href="/dashboard"
        className="text-purple-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-4xl font-light mb-8 text-purple-700">
        Other Birthdays
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && users.length === 0 && (
        <p className="text-gray-500">No friends added yet!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user, index) => {
          const { day, month, diffDays } = formatBirthday(user.birthday);

          return (
            <div
              key={user.id}
              onClick={() => toggleExpand(index)}
              className="p-[2px] rounded-3xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:scale-[1.02] transition cursor-pointer"
            >
              <div className="bg-white rounded-3xl p-6 h-full shadow-lg">
                <h2 className="text-2xl font-bold text-purple-700 mb-2">
                  {user.name}
                </h2>

                {user.birthday !== "Not set" && (
                  <>
                    <p className="text-xl font-semibold text-gray-800">
                      {month} {day}
                    </p>
                    <p className="text-lg text-gray-500">{diffDays} days left</p>
                  </>
                )}

                {user.expanded && (
                  <div className="mt-4">
                    {user.wishlist.length === 0 ? (
                      <p className="text-gray-400">No wishlist yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {user.wishlist.map((item, i) => (
                          <li
                            key={i}
                            className={`flex justify-between items-center px-3 py-2 rounded-lg ${
                              item.reservedBy
                                ? "bg-purple-100"
                                : "bg-purple-50"
                            }`}
                          >
                            <span className="text-purple-800">
                              {item.name}
                            </span>

                            <div className="flex flex-col items-end text-sm gap-1">
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Link
                                </a>
                              )}

                              {item.reservedBy === currentUserId && (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReserve(user.id, i);
                                  }}
                                  className="cursor-pointer text-green-600"
                                >
                                  ✅ Reserved
                                  <p className="text-purple-600 underline">
                                    Click to unreserve
                                  </p>
                                </div>
                              )}

                              {item.reservedBy &&
                                item.reservedBy !== currentUserId && (
                                  <span className="text-green-600">
                                    ✅ Reserved
                                  </span>
                                )}

                              {!item.reservedBy && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReserve(user.id, i);
                                  }}
                                  className="text-purple-700 hover:text-purple-900"
                                >
                                  ❤️ Reserve
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
