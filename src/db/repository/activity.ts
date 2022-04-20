import db, { auth } from "..";
import { collection, addDoc, query, getDocs, where, orderBy, Timestamp, doc, getDoc, deleteDoc, limit } from 'firebase/firestore';
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
    return { id: docSnap.id, ...docSnap.data() } as ActivityData;
  } else {
    return null;
  }
}

// deleting activities by using user activity collection id
export const deleteActivity = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);

}
// retriving all activites of current user
export const deleteAllActivitiesByUserId = async (uid: any) => {
  const q = query(collection(db, COLLECTION_NAME), where("uid", "==", uid));
  const activitiesSnapshot = await getDocs(q);
  activitiesSnapshot.docs.forEach(async (_data) => {
    await deleteActivity(_data.id);
  });
}

export const getActivityListByUserIds = async (interest: string, memberIds: string[]): Promise<ActivityData[]> => {
  const q = query(collection(db, COLLECTION_NAME), where('interest', '==', interest), where('uid', 'in', memberIds), limit(10));
  const activitiesSnapshot = await getDocs(q);

  const data: Array<any> = [];

  activitiesSnapshot.docs.forEach((_data) => {
    data.push({ id: _data.id, ..._data.data() });
  });


  return activitiesSnapshot.docs.length > 0 ? data as Array<ActivityData> : [];
}
