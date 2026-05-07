import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const GAME_DOC_PATH = ['games', 'active'];
const PLAYERS_COL_PATH = ['games', 'active', 'players'];

const gameDocRef = () => doc(db, ...GAME_DOC_PATH);
const playersColRef = () => collection(db, ...PLAYERS_COL_PATH);

export function useGame() {
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsubGame = onSnapshot(
      gameDocRef(),
      (snap) => {
        setGame(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    const unsubPlayers = onSnapshot(
      query(playersColRef(), orderBy('createdAt', 'asc')),
      (snap) => {
        setPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => setError(err),
    );
    return () => {
      unsubGame();
      unsubPlayers();
    };
  }, []);

  return { game, players, loading, error };
}

export async function createGame({ date, time, maxPlayers }) {
  if (!db) throw new Error('Firebase not configured');
  const playersSnap = await getDocs(playersColRef());
  await Promise.all(playersSnap.docs.map((d) => deleteDoc(d.ref)));
  await setDoc(gameDocRef(), {
    date,
    time,
    maxPlayers: Number(maxPlayers),
    createdAt: serverTimestamp(),
  });
}

export async function registerPlayer(name) {
  if (!db) throw new Error('Firebase not configured');
  await addDoc(playersColRef(), {
    name: name.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function updatePlayerName(id, name) {
  if (!db) throw new Error('Firebase not configured');
  await updateDoc(doc(db, ...PLAYERS_COL_PATH, id), {
    name: name.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function removePlayer(id) {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, ...PLAYERS_COL_PATH, id));
}
