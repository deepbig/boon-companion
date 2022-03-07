import db from "..";
import { collection, addDoc, query, getDocs } from 'firebase/firestore';
import { ActivityData, UserActivityData } from "types";
;
const COLLECTION_NAME = "user_interest_activity";

async function saveActivity(updateActivity: any) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      date: updateActivity.date,
      description: updateActivity.description,
      performance: updateActivity.values,
      duration: updateActivity.duration
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const getActivities = async (): Promise<Array<UserActivityData>> => {
  const q = query(collection(db, COLLECTION_NAME));

  const usersSnapshot = await getDocs(q);
  const data: Array<any> = [];

  usersSnapshot.docs.forEach((_data) => {
    data.push({ ..._data.data() });
  })

  return usersSnapshot.docs.length > 0 ? data as Array<UserActivityData> : [];
}
export { saveActivity };