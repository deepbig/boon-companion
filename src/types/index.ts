export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',
    CREATEGROUP = 'CreateGroup',
}

export type UserData = {
    displayName: string;
    email: string;
    photoURL: string;
    gender: string;
    hostileRating: number;
    levelOfExperience: number;
    peerRating: number;
    interest: string[];
} | null | string; // string is error container

export interface ActivityData {
    id?: string;
    category: string;
    date: any;
    level: number;
    note: string;
    values: number;
};

export type CategoryData = {
    category?: string;
    subcategories?: string[];
} | null;

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