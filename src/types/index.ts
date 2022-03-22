export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',   
}

export type UserData = {
    displayName: string;
    email: string;
    photoURL: string;
    gender: string;
    age: number;
    hostileRating: number;
    levelOfExperience: number;
    peerRating: number;
    interests: string[];
} | null;

export type CreateGroupFormData = {
  name: string;
  title: string;
  gender: string;
  interest: string;
  age: number[];
  peerRating: number[];
  hostileRating: number[];
  levelOfExperience: number[];
  description: string;
};

export type GroupData = {
  name: string;
  title: string;
  minAge: number;
  maxAge: number;
  gender: string;
  interest: string;
  owner: string;
  peerRatingMin: number;
  peerRatingMax: number;
  hostileRatingMin: number;
  hostileRatingMax: number;
  levelOfExperienceMin: number;
  levelOfExperienceMax: number;
  description: string;
};



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