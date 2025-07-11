import { db } from "./firebase";
import { doc, getDoc, setDoc, query, collection, where, getDocs, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

// ✅ Safely get or create invite code
export async function getOrCreateInviteCode(uid: string) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    if (data.inviteCode) {
      return data.inviteCode; // Already has code
    }
  }

  // Generate new unique code
  const newCode = nanoid(8);

  // ✅ Use setDoc with merge: true to create or update safely
  await setDoc(userRef, { inviteCode: newCode }, { merge: true });

  return newCode;
}

// ✅ Add friend by invite code — two-way link
export async function addFriendByInviteCode(myUid: string, inviteCode: string) {
  // Get my data to check my own code
  const mySnap = await getDoc(doc(db, "users", myUid));
  const myData = mySnap.exists() ? mySnap.data() : {};
  if (myData.inviteCode === inviteCode) {
    throw new Error("Cannot add yourself!");
  }

  // Find friend by invite code
  const q = query(collection(db, "users"), where("inviteCode", "==", inviteCode));
  const querySnap = await getDocs(q);
  if (querySnap.empty) throw new Error("Invite code not found!");

  const friendDoc = querySnap.docs[0];
  const friendId = friendDoc.id;

  const myRef = doc(db, "users", myUid);
  const friendRef = doc(db, "users", friendId);

  // Add each other to friends arrays
  await updateDoc(myRef, {
    friends: Array.from(new Set([...(myData.friends || []), friendId])),
  });

  const friendSnap = await getDoc(friendRef);
  const friendData = friendSnap.exists() ? friendSnap.data() : {};

  await updateDoc(friendRef, {
    friends: Array.from(new Set([...(friendData.friends || []), myUid])),
  });

  return true;
}
