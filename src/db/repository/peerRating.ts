import db from "..";
import { collection, query, getDocs, updateDoc, doc, where, addDoc } from 'firebase/firestore';
import { PeerRatingData } from "types";
const COLLECTION_NAME = "peer_ratings";

export const getAllPeerRatingsByUserId = async (uid: string): Promise<PeerRatingData[]> => {
    const q = query(collection(db, COLLECTION_NAME), where("assignedTo", "==", uid));

    const peerRatingSnapshot = await getDocs(q);

    const data: Array<any> = [];

    peerRatingSnapshot.docs.forEach((_data) => {
        data.push({ id: _data.id, ..._data.data() });
    });

    return data as Array<PeerRatingData>;
}

export const setPeerRatingByPeerRatingId = async (pid: string, newRating: number) => {
    const docRef = doc(db, COLLECTION_NAME, pid);
    await updateDoc(docRef, {
        rating: newRating
    })
}

export const addPeerRating = async (assignedFrom: string, assignedTo: string, rating: number) => {
    await addDoc(collection(db, COLLECTION_NAME), {
        assignedFrom: assignedFrom,
        assignedTo: assignedTo,
        rating: rating
    });
}