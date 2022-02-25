export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',
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