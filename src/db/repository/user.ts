import db from "..";
import { collection, doc, getDoc, setDoc, getDocs, query, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
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
                peerRating: 10,
                interests: [],
                totalPosts: 0,
                totalProfanities: 0,
                performances: [],
                groups: [],
                age: null,
            });
        } catch (e) {
            // need to handle error case.
            return null as UserData;
        }
        const newDocSnap = await getDoc(docRef);
        return newDocSnap.data() as UserData;
    }
}

export const getUserFromDB = async (uid: string): Promise<UserData> => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserData;
    } else {
        alert('user does not exist!');
        return null;
    }
}

export const updateUser = async (uid: string, userData: UserData): Promise<UserData> => {
    try {
        await setDoc(doc(db, COLLECTION_NAME, uid), {
            ...userData
        });
    } catch (e) {
        // need to handle error case.
        return null as UserData;
    }
    const docRef = doc(db, COLLECTION_NAME, uid);
    const newDocSnap = await getDoc(docRef);
    return newDocSnap.data() as UserData;
}

export const addUserInterest = async (uid: string, interest: string) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, {
        interests: arrayUnion(interest)
    });
}

export const addUserGroup = async (uid: string, group: string) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, {
        groups: arrayUnion(group)
    });
}

export const delUserGroup = async (uid: string, group: string) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, {
        groups: arrayRemove(group)
    })
}

export const deleteUser = async (uid: any) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await deleteDoc(docRef);
}


export const updateUserInterest = async (uid: string, name: string, totalPractices: number, totalDurations: number) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const key = `performances.${name}`;
    await updateDoc(docRef, {
        'levelOfExperience': totalDurations > 600000
            ? '10'
            : Math.ceil(totalDurations / 60000),
        [key]: {
            totalPractices: +totalPractices,
            totalDurations: +totalDurations,
        },
    })
}

export const updateUserHostileRating = async (uid: string, totalPosts: number, totalProfanities: number) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, {
        hostileRating: +(totalProfanities / totalPosts * 10).toFixed(2),
        totalPosts: totalPosts,
        totalProfanities: totalProfanities,
    })
}

export const updateUserPeerRating = async (uid: string, peerRating: number) => {
    const docRef = doc(db, COLLECTION_NAME, uid);
    console.log("peer rating", peerRating);
    await updateDoc(docRef, {
        peerRating: peerRating
    });
}