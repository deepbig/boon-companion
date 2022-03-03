import db from "..";
import { collection, getDocs, query } from 'firebase/firestore';
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