import db from "..";
import { collection, query, getDocs, setDoc, doc } from 'firebase/firestore';
const COLLECTION_NAME = "interests";

export const getAllInterests = async (): Promise<string[]> => {
    const q = query(collection(db, COLLECTION_NAME));

    const interestSnapshot = await getDocs(q);

    const data: Array<any> = [];

    interestSnapshot.docs.forEach((_data) => {
        data.push({ ..._data.data() });
    });

    return data as Array<string>;
}

export const setInterest = async (interest: string): Promise<string> => {
    if (interest) {
        let splitStr = interest.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        interest = splitStr.join(' ');
        await setDoc(doc(db, COLLECTION_NAME, interest), {
            label: interest
        });
        return interest;
    } else {
        alert("Your input is empty! Please type your interest to continue.");
        return '';
    }
}