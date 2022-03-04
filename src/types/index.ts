export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',
    CREATEGROUP = 'CreateGroup',
}

export type UserData = {
    id: string;
    name: string;
} | null;

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