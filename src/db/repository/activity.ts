import db, { auth } from "..";
import { collection, addDoc, query, getDocs, where, orderBy, Timestamp, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ActivityAddFormData, ActivityData } from "types";
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
    console.log(docSnap.id);
    return docSnap.data() as ActivityData;
  } else {
    return null;
  }
}
// deleting activities by using user activity collection id
export const deleteActivities = async (uid: any) => {
  const docRef = doc(db, COLLECTION_NAME, uid);
  await deleteDoc(docRef);
}
// retriving all activites of current user
export const getCurrentUserActivityId = async (uid: any) => {
  const q = query(collection(db, COLLECTION_NAME), where("uid", "==", uid));
  const activitiesSnapshot = await getDocs(q);
  const data: Array<any> = [];
   activitiesSnapshot.docs.forEach((_data) => {
      data.push({ id: _data.id });
      deleteActivities(_data.id);
    });
}
