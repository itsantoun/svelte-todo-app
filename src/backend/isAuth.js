import { writable } from 'svelte/store';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const userIsAuth = writable(null);

onAuthStateChanged(auth, (firebaseUser) => {
  userIsAuth.set(firebaseUser);
});
