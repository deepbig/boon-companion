export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',  
    GROUP = 'Group', 
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