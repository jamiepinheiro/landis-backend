export interface UpdateAccountRequest {
    accountToken: number;
    active?: boolean;
    address?: string;
    balance?: string;
    comments?: string;
    created?: string;
    credit?: number;
    email?: string;
    employer?: string;
    name_first?: string;
    name_last?: string;
    picture?: string;
    tags?: string[];
}