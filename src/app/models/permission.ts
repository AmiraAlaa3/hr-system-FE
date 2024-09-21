export interface Permission {
    id?: number;
    page: string;
    view: 'true' | 'false';
    add: 'true' | 'false';
    edit: 'true' | 'false';
    delete: 'true' | 'false';
}
