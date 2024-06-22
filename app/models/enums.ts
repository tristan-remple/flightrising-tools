export enum Elements {
    light = "light",
    lightning = "lightning",
    fire = "fire",
    arcane = "arcane",
    plague = "plague",
    earth = "earth",
    ice = "ice",
    shadow = "shadow",
    wind = "wind",
    water = "water",
    nature = "nature",
    neutral = "neutral"
}

export const festivals = {
    [Elements.light]: ["Brightshine Jubilee"],
    [Elements.lightning]: ["Thundercrack Carnivale"],
    [Elements.fire]: ["Flameforger's Festival"],
    [Elements.arcane]: ["Starfall Celebration"],
    [Elements.plague]: ["Riot of Rot"],
    [Elements.earth]: ["Rockbreaker's Ceremony"],
    [Elements.ice]: ["Crystalline Gala"],
    [Elements.shadow]: ["Trickmurk Circus"],
    [Elements.wind]: ["Mistral Jamboree"],
    [Elements.water]: ["Wavecrest Saturnalia"],
    [Elements.nature]: ["Greenskeeper Gathering"],
    [Elements.neutral]: [
        "Night of the Nocturne",
        "Warrior's Way",
        "Drakeharvest",
        "Frigidfin Expedition",
        "Springswarm",
        "Sunparched Prowl"
    ]
}

export enum Food {
    plant = "Plants",
    seafood = "Seafood",
    insect = "Insects",
    meat = "Meat"
}