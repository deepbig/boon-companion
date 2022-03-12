import * as firebase from '@firebase/testing';

const MY_PROJECT_ID = 'boon-companion';
const myId = "user_abc";
const theirId = "user_xyz";
const myAuth = { uid: myId, email: "abc@abc.com" };
const myUserDoc = {
  displayName: "Test Boon Companion",
  email: myAuth.email,
  gender: null,
  hostileRating: 0,
  interest: [],
  levelOfExperience: 0,
  peerRating: 0,
  photoURL: "https://lh3.googleusercontent.com/a/AATXAJys_eFT4s9d31IHYpB7NpW4Q_fryVZGGnthUVMy=s96-c"
}
const myActivityId = "activity_abc"
const theirActivityId = "activity_xyz"
const myActivityDoc = {
  date: "2022-03-13",
  description: "Testing activity",
  duration: 120,
  interest: "Testing",
  performance: 10,
  uid: myId
}
const theirActivityDoc = {
  date: "2022-03-13",
  description: "Testing activity",
  duration: 120,
  interest: "Testing",
  performance: 10,
  uid: theirId
}

const getFirestore = (auth: { uid: string; email: string; } | null) => {
  //@ts-ignore
  return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
}

const getAdminFirestore = () => {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
})

describe('Firestore Database testing suite', () => {

  test("Can't create interest collection without auth", async () => {
    const db = getFirestore(null);
    const testDoc = db.collection("interests").doc("Testing");
    await firebase.assertFails(testDoc.set({ label: "Testing" }));
  });

  test("Can create interest collection with auth", async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection("interests").doc("Testing");
    await firebase.assertSucceeds(testDoc.set({ label: "Testing" }));
  });

  test('Create interest collection', async () => {
    const db = getFirestore(myAuth);
    const interestId = "Testing";
    const setupDoc = db.collection("interests").doc(interestId);
    await setupDoc.set({ label: "Testing" });

    const testRead = db.collection("interests").doc(interestId);
    await firebase.assertSucceeds(testRead.get());
  });

  test('Fail to Delete interest collection', async () => {
    const db = getFirestore(myAuth);
    const interestId = "Testing";
    const deleteDoc = db.collection("interests").doc(interestId);
    await firebase.assertFails(deleteDoc.delete());
  });

  test('Fail to Update interest collection', async () => {
    const db = getFirestore(myAuth);
    const interestId = "Testing";
    const deleteDoc = db.collection("interests").doc(interestId);
    await firebase.assertFails(deleteDoc.update({ label: "Testings" }));
  });

  test("Can write to a user document with the same ID as our user", async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection("users").doc(myId);
    await firebase.assertSucceeds(testDoc.set(myUserDoc));
  });

  test("Can't write to a user document with the same ID as our user", async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection("users").doc(theirId);
    await firebase.assertFails(testDoc.set(myUserDoc));
  });

  test("Create user profile", async () => {
    const db = getFirestore(myAuth);
    const setupDoc = db.collection("users").doc(myId);
    await setupDoc.set(myUserDoc);

    const testRead = db.collection("users").doc(myId);
    await firebase.assertSucceeds(testRead.get());
  });

  test("Can't read activities without auth", async () => {
    const db = getFirestore(null);
    const testQuery = db.collection("user_interest_activity").where("uid", "==", myId);
    await firebase.assertFails(testQuery.get());
  });

  test("Can't read other activities with auth", async () => {
    const db = getFirestore(myAuth);
    const testQuery = db.collection("user_interest_activity").where("uid", "==", theirId);
    await firebase.assertFails(testQuery.get());
  });

  test("Can read my activities", async () => {
    const db = getFirestore(myAuth);
    const testQuery = db.collection("user_interest_activity").where("uid", "==", myId);
    await firebase.assertSucceeds(testQuery.get());
  });

  test("Create my activity", async () => {
    const db = getFirestore(myAuth);
    const setupDoc = db.collection("user_interest_activity").doc(myActivityId);
    await setupDoc.set(myActivityDoc);

    const testRead = db.collection("user_interest_activity").doc(myActivityId);
    await firebase.assertSucceeds(testRead.get());
  });

  test("Fail to update other's activity", async () => {
    const admin = getAdminFirestore();
    const setupDoc = admin.collection("user_interest_activity").doc(theirActivityId);
    await setupDoc.set(theirActivityDoc);

    const db = getFirestore(myAuth);
    const testUpdate = db.collection("user_interest_activity").doc(theirActivityId);
    await firebase.assertFails(testUpdate.set(myActivityDoc));
  });
});