import { auth } from '..';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

export const signIn = () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider);
}

export const onAuthChange = (callback: any) => {

    return onAuthStateChanged(auth, (user) => {
        callback(user);
    })
}

export const signOutUser = () => {
    return signOut(auth);
}
