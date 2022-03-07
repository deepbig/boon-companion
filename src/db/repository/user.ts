import db from "..";
import { collection, doc, getDoc, setDoc, getDocs, query } from 'firebase/firestore';
import { UserData } from 'types';
const COLLECTION_NAME = "users";

export const getAllUsers = async (): Promise<Array<UserData>> => {
    const q = query(collection(db, COLLECTION_NAME));

    const usersSnapshot = await getDocs(q);
    const data: Array<any> = [];

    usersSnapshot.docs.forEach((_data) => {
        console.log(_data);
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
                interest: [],
            });
        } catch (e) {
            return "error generated during saving user data" as UserData;
        }
        const newDocSnap = await getDoc(docRef);
        return newDocSnap.data() as UserData;
    }
}