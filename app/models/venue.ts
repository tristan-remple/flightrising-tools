import { Elements, Food } from './enums'

export type ElementStats = {
    percent: number,
    currencyPerHour: number
}

export type Item = {
    name: string,
    type: string,
    id: number
}

export type otherRequirement = {
    item: Item,
    aquisition: {
        method: string,
        level: number,
        location: string[]
    },
    numberRequired: number
}

export type CombinationItem = {
    item: Item,
    target: Item,
    dropsFrom: string[],
    numberRequired: number,
    otherIngredients: otherRequirement[],
    festival?: string
}

export type Familiar = {
    item: Item,
    boss: boolean,
    fiona: boolean
}

export type Venue = {
    title: string,
    startingLevel: number,
    endingLevel: number,
    scene: boolean,
    apparel: Item[],
    maxEnemyCount: number,
    exaltTraining: boolean,
    elements: { [key in Elements]: ElementStats },
    food: { [key in Food]: number },
    familiars: Familiar[],
    swipp: CombinationItem[],
    baldwin: CombinationItem[],
}