export type UserItem = {
    id: number,
    obtained: boolean,
    inventory: number,
    target: boolean
}

export type User = {
    name: string,
    id: number,
    password: string,
    email: string,
    familiars: UserItem[],
    swipp: UserItem[],
    baldwin: UserItem[],
    apparel: UserItem[],
    scenes: UserItem[]
}