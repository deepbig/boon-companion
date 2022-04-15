import db from "..";
import { collection, query, getDocs, where, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { GroupData, GroupSearchFormData, MemberData } from "types";
const COLLECTION_NAME = "groups";

export const getGroupsByCriteria = async (criteria: GroupSearchFormData, uid: string): Promise<GroupData[]> => {
    const q = query(collection(db, COLLECTION_NAME), where("interest", "==", criteria.interest), where("gender", "==", criteria.gender));

    const groupSnapshot = await getDocs(q);

    const data: Array<any> = [];

    groupSnapshot.docs.forEach((_data) => {
        if (_data.data().minAge >= criteria.age[0] && _data.data().maxAge <= criteria.age[1] &&
            _data.data().peerRatingMin >= criteria.peerRating[0] && _data.data().peerRatingMax <= criteria.peerRating[1] &&
            _data.data().hostileRatingMin >= criteria.hostileRating[0] && _data.data().hostileRatingMax <= criteria.hostileRating[1] &&
            _data.data().levelOfExperienceMin >= criteria.levelOfExperience[0] && _data.data().levelOfExperienceMax <= criteria.levelOfExperience[1]) {
            // need to check whether the member already joined this group.
            if (!(_data.data().members?.some((member: MemberData) => member.uid === uid))) {
                data.push({ id: _data.id, ..._data.data() });
            }
        }
    });

    return data as Array<GroupData>;
}

export const joinGroupAsMember = async (memberData: MemberData, group: GroupData) => {
    //@ts-ignore
    const docRef = doc(db, COLLECTION_NAME, group.id);
    await updateDoc(docRef, {
        members: arrayUnion(memberData)
    });
}

export const getUserJoinedGroup = async (groupIds: string[]) => {
    const data: Array<any> = [];

    for (const groupId of groupIds) {
        if (groupId !== "test_group") {
            const docRef = doc(db, COLLECTION_NAME, groupId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                data.push({ id: docSnap.id, ...docSnap.data() })
            }
        }
    }

    return data.length > 0 ? data as Array<GroupData> : [];
}

export const exitAllGroupsByUserId = async (uid: string, groups: string[]) => {
    groups.forEach(async (groupId) => {
        await exitGroupByUserId(uid, groupId);
    })
}

export const exitGroupByUserId = async (uid: string, groupId: string) => {
    const docRef = doc(db, COLLECTION_NAME, groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const group = docSnap.data() as GroupData;
        const newMembers = group.members.filter((member) => member.uid !== uid);
        await updateDoc(docRef, {
            members: newMembers
        })
    }
}