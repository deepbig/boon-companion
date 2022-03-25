export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',
}

export type UserData = {
    displayName: string;
    email: string;
    photoURL: string;
    gender: 'male' | 'female' | 'other' | null;
    age: number;
    hostileRating: number;
    levelOfExperience: number;
    peerRating: number;
    interests: string[];
    groups: string[];
} | null;

export interface ActivityData {
    id?: string;
    interest: string; // category
    description: string; // note
    date: any;
    duration: number; // mins
    performance: number; // values (optional: any value is possible);
};

export interface ActivityAddFormData {
    interest: string;
    date: string;
    description: string;
    duration: number;
    performance: number;
    uid: string;
}

export interface GroupSearchFormData {
    interest: string;
    age: number[];
    peerRating: number[];
    gender: 'male' | 'female' | 'other' | 'both' | null;
    hostileRating: number[];
    levelOfExperience: number[];
}

export interface MemberData {
    uid: string,
    displayName: string;
    email: string;
    photoURL: string;
}

export interface GroupData {
    id: string;
    name: string;
    title: string;
    description: string;
    minAge: number;
    maxAge: number;
    gender: string;
    owner: string;
    interest: string;
    peerRatingMin: number;
    peerRatingMax: number;
    hostileRatingMin: number;
    hostileRatingMax: number;
    levelOfExperienceMin: number;
    levelOfExperienceMax: number;
    members: MemberData[];
}

declare module '@mui/material/styles' {
    interface TypographyVariants {
        guideline: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        guideline?: React.CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        guideline: true;
    }
}