import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

export async function getTopScores(game) {
  const scoresRef = collection(db, "scores");

  const q = query(
    scoresRef,
    where("game", "==", game),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function submitScore(game, initials, score) {
  await addDoc(collection(db, "scores"), {
    game,
    initials: initials.toUpperCase(),
    score: Number(score),
    createdAt: serverTimestamp()
  });
}