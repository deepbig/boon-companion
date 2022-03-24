import db from "..";
import { collection, query, getDocs, where } from 'firebase/firestore';
import { GroupData, GroupSearchFormData } from "types";
const COLLECTION_NAME = "groups";

export const getGroupsByCriteria = async (criteria: GroupSearchFormData): Promise<GroupData[]> => {
    const q = query(collection(db, COLLECTION_NAME), where("interest", "==", criteria.interest), where("gender", "==", criteria.gender));

    const groupSnapshot = await getDocs(q);

    const data: Array<any> = [];

    groupSnapshot.docs.forEach((_data) => {
        if (_data.data().minAge >= criteria.age[0] && _data.data().maxAge <= criteria.age[1] &&
            _data.data().peerRatingMin >= criteria.peerRating[0] && _data.data().peerRatingMax <= criteria.peerRating[1] &&
            _data.data().hostileRatingMin >= criteria.hostileRating[0] && _data.data().hostileRatingMax <= criteria.hostileRating[1] &&
            _data.data().levelOfExperienceMin >= criteria.levelOfExperience[0] && _data.data().levelOfExperienceMax <= criteria.levelOfExperience[1]) {
            data.push({ ..._data.data() });
        }
    });

    return data as Array<GroupData>;
}

export const joinGroup = async (uid: string, group: GroupData) => {

}