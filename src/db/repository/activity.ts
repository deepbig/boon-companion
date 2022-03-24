import db, { auth } from "..";
import { collection, addDoc, query, getDocs, where, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { ActivityAddFormData, ActivityData } from "types";
;
const COLLECTION_NAME = "user_interest_activity";

// retrieve current (1 year) activities
export const current = async (selectedInterest: string): Promise<Array<ActivityData>> => {
  const end = new Date();
  const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
  const currentUser = auth.currentUser;

  if (currentUser && selectedInterest) {
    const q = query(collection(db, COLLECTION_NAME), where("uid", "==", currentUser.uid),
      where("interest", "==", selectedInterest), where("date", ">=", start), where("date", "<", end),
      orderBy("date"));

    const activitiesSnapshot = await getDocs(q);
    const data: Array<any> = [];

    activitiesSnapshot.docs.forEach((_data) => {
      data.push({ id: _data.id, ..._data.data() });
    });

    // return and convert back it array of activity
    return data as Array<ActivityData>;
  } else {
    return [] as Array<ActivityData>;
  }
}

export const saveActivity = async (values: ActivityAddFormData): Promise<ActivityData | null> => {

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    interest: values.interest,
    date: Timestamp.fromDate(new Date(values.date)),
    description: values.description,
    duration: +values.duration,
    performance: +values.performance,
    uid: values.uid,
  });
  const newDocRef = doc(db, COLLECTION_NAME, docRef.id);
  const docSnap = await getDoc(newDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as ActivityData;
  } else {
    return null;
  }
}

// async function saveActivity(updateActivity: any) {
//   try {
//     const docRef = await addDoc(collection(db, COLLECTION_NAME), {
//       date: updateActivity.date,
//       description: updateActivity.description,
//       performance: updateActivity.values,
//       duration: updateActivity.duration
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

// export const getActivities = async (): Promise<Array<UserActivityData>> => {
//   const q = query(collection(db, COLLECTION_NAME));

//   const usersSnapshot = await getDocs(q);
//   const data: Array<any> = [];

//   usersSnapshot.docs.forEach((_data) => {
//     data.push({ ..._data.data() });
//   })

//   return usersSnapshot.docs.length > 0 ? data as Array<UserActivityData> : [];
// }
// export { saveActivity };