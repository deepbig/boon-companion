import db from "..";
import { collection, doc, getDoc, setDoc, getDocs, query, updateDoc, arrayUnion, deleteDoc   } from 'firebase/firestore';
import { UserData } from 'types';
const COLLECTION_NAME = "users";

export const getAllUsers = async (): Promise<Array<UserData>> => {
    const q = query(collection(db, COLLECTION_NAME));

    const usersSnapshot = await getDocs(q);
    const data: Array<any> = [];

    usersSnapshot.docs.forEach((_data) => {
        data.push({ ..._data.data() });
    })

    return usersSnapshot.docs.length > 0 ? data as Array<UserData> : [];
}

export const getLoggedInUser = async (user: { uid: string; displayName: any; email: any; photoURL: any; }): Promise<UserData> => {
    const docRef = doc(db, COLLECTION_NAME, user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserData;
    } else {
        // add doc
        try {
            await setDoc(doc(db, COLLECTION_NAME, user.uid), {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                gender: null,
                hostileRating: 0,
                levelOfExperience: 0,
                peerRating: 0,
                interests: [],
            });
        } catch (e) {
            // need to handle error case.
            return null as UserData;
        }
        const newDocSnap = await getDoc(docRef);
        return newDocSnap.data() as UserData;
    }
}

export const getUser = async (uid: string): Promise<UserData> => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserData;
    } else {
        alert('user does not exist!');
        return null;
    }
}

export const addUserInterest = async (uid: string, interest: string) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, {
        interests: arrayUnion(interest)
    });
}

export const deleteUser = async (uid: any) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await deleteDoc(docRef);
}