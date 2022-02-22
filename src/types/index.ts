export enum PageName {
    LANDING = '',
    SIGIN = '',
    DASHBOARD = 'Dashboard',
}

export type UserData = {
    id: string;
    name: string;
} | null;