"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { festivals, Elements, Food } from "../models/enums"
import { Venue, CombinationItem, Item, Familiar } from "../models/venue"
import Link from "next/link"

const QuestionsPage = () => {

    // ---SETUP
    // fetch and distribute initial data
    const [ error, setError ] = useState<string | null>("Loading...")
    const [ venueList, setVenueList ] = useState<Venue[]>([])
    const [ filteredVenueList, setFilteredVenueList ] = useState<Venue[]>([])
    const [ swippList, setSwippList ] = useState<CombinationItem[]>([])
    const [ baldwinList, setBaldwinList ] = useState<CombinationItem[]>([])
    const [ apparelList, setApparelList ] = useState<Item[]>([])
    const [ familiarList, setFamiliarList ] = useState<Familiar[]>([])
    const [ sceneList, setSceneList ] = useState<string[]>([])
    useEffect(() => {
        (async() => {
            try {
                const response = await fetch("/data")
                const data = await response.json()
                if (data.success) {
                    setVenueList(data.venues)
                    setFilteredVenueList(data.venues)
                    let newSwippList: CombinationItem[] = []
                    let newBaldwinList: CombinationItem[] = []
                    let newApparelList: Item[] = []
                    let newFamiliarList: Familiar[] = []
                    let newSceneList: string[] = []
                    data.venues.forEach((venue: Venue) => {
                        newSwippList.push(...venue.swipp)
                        newBaldwinList.push(...venue.baldwin)
                        newApparelList.push(...venue.apparel)
                        newFamiliarList.push(...venue.familiars)
                        if (venue.scene) {
                            newSceneList.push(venue.title)
                        }
                    })
                    newSwippList = newSwippList.filter(item => item.item.name !== "")
                    newBaldwinList = newBaldwinList.filter(item => item.item.name !== "")
                    newApparelList = newApparelList.filter(item => item.name !== "")
                    newFamiliarList = newFamiliarList
                        .filter(item => item.item.name !== "")
                        .filter((value, index, array) => {
                            return index === array.map(item => item.item.id).indexOf(value.item.id)
                        })
                    setSwippList(newSwippList)
                    setBaldwinList(newBaldwinList)
                    setApparelList(newApparelList)
                    setFamiliarList(newFamiliarList)
                    setSceneList(newSceneList)
                    setError(null)
                }
            } catch(err) {
                setError("Data not found.")
            }
        })()
    }, [])

    // ---TARGET
    // first dropdown
    // always present
    const [ goals, setGoals ] = useState<{ [key: string]: boolean }>({
        festival: false,
        swipp: false,
        baldwin: false,
        scene: false,
        apparel: false,
        familiar: false,
        food: false,
        uncertain: false
    })
    const goalHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
        const newGoals = {...goals}
        for (let target in goals) {
            newGoals[target] = selected.some(option => option === target)
        }
        setGoals(newGoals)
    }

    // ---FESTIVAL
    // festival goal dropdown
    // displays if goals.festival is true
    // sorts the venues by currency per hour
    // festival sort takes priority over food sort
    const [ festivalGoal, setFestivalGoal ] = useState<string | null>(null)
    const festivalHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        setFestivalGoal(e.target.value)
    }
    const festivalSelect = <>
        <label htmlFor="festivalSelect">Is there a festival on right now?</label>
        <select name="festivalSelect" onChange={ (e) => festivalHandler(e) }>
            { Object.keys(festivals).map(element => {
                return festivals[element as Elements].map(fest => {
                    return <option value={ fest } key={ fest } >{ fest }</option>
                })
            }) }
        </select>
    </>

    // ---FOOD
    // displays if goals.food is true
    // sorts venues by selected food points per hour
    // festival sort takes priority over food sort
    const [ foodGoals, setFoodGoals ] = useState<string[]>([])
    const foodHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
        const newFoodGoals = (Object.keys(Food) as Array<keyof typeof Food>).filter(food => {
            return selected.some(selectedFood => selectedFood === food)
        })
        setFoodGoals(newFoodGoals)
    }
    const foodSelect = <>
        <label htmlFor="foodSelect">What kind of food do you need?</label>
        <select name="foodSelect" multiple onChange={ (e) => foodHandler(e) } >
            { (Object.keys(Food) as Array<keyof typeof Food>).map((key) => {
                return <option value={ key } key={ key } >{ Food[key] }</option>
            })}
        </select>
    </>

    // ---SWIPP
    // displays if goals.swipp is true
    // can be switched between an OR filter or an AND filter by the picky toggle
    // defaults to not picky (OR)
    const [ swippGoals, setSwippGoals ] = useState<CombinationItem[]>([])
    const swippHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
        const newSwippGoals = swippList.filter(trade => {
            return selected.includes(trade.target.name)
        })
        setSwippGoals(newSwippGoals)
    }
    const swippSelect = <>
        <label htmlFor="swippSelect">Which Swipp trades are you aiming for?</label>
        <select name="swippSelect" multiple onChange={ (e) => swippHandler(e) }>
            { swippList.map(item => {
                return <option value={ item.target.name } key={ `${ item.target.id }-${ item.item.id }` } >{ item.target.name }</option>
            })}
        </select>
    </>

    // ---BALDWIN
    // displays if goals.baldwin is true
    // can be switched between an OR filter or an AND filter by the picky toggle
    // defaults to not picky (OR)
    const [ baldwinGoals, setBaldwinGoals ] = useState<CombinationItem[]>([])
    const baldwinHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
        const newBaldwinGoals = baldwinList.filter(recipe => {
            return selected.includes(recipe.target.name)
        })
        setBaldwinGoals(newBaldwinGoals)
    }
    const baldwinSelect = <>
        <label htmlFor="baldwinSelect">Which Baldwin recipes are you aiming for?</label>
        <select name="baldwinSelect" multiple onChange={ (e) => baldwinHandler(e) } >
            { baldwinList.map(item => {
                return <option value={ item.target.name } key={ `${ item.target.id }-${ item.item.id }` } >{ item.target.name }</option>
            })}
        </select>
    </>

    // ---SCENE
    // displays if goals.scene is true
    // does not obey the picky toggle; always OR filter
    const [ sceneGoals, setSceneGoals ] = useState<string[]>([])
    const sceneHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
        setSceneGoals(selected)
    }
    const sceneSelect = <>
        <label htmlFor="sceneSelect">Which scenes are you aiming for?</label>
        <select name="sceneSelect" multiple onChange={ (e) => sceneHandler(e) } >
            { sceneList.map(scene => {
                return <option value={ scene } key={ scene } >{ scene }</option>
            })}
        </select>
    </>

    const apparelSelect = <>
        <label htmlFor="apparelSelect">Which apparel drops are you aiming for?</label>
        <select name="apparelSelect" multiple>
            { apparelList.map(item => {
                return <option value={ item.name } key={ item.id } >{ item.name }</option>
            })}
        </select>
    </>

    const familiarSelect = <>
        <label htmlFor="familiarSelect">Which familiars are you aiming for?</label>
        <select name="familiarSelect" multiple>
            { familiarList.map(item => {
                return <option value={ item.item.name } key={ item.item.id } >{ item.item.name }</option>
            }) }
        </select>
    </>

    const [ picky, setPicky ] = useState(false)
    const pickyHandler = () => {
        const newPicky = picky ? false : true
        setPicky(newPicky)
    }

    // ---APPLY OPTIONS
    // when the goals dropdowns are changed, update the list of venues
    useEffect(() => {
        let newVenueList = [...venueList]

        // ---FILTERING
        // ---SWIPP
        let swippVenueList: Venue[] = []
        if (goals.swipp && swippGoals.length > 0) {
            if (!picky) {
                // OR filter: not picky, any venue that has at least one item is fine
                swippVenueList = newVenueList.filter(venue => {
                    return (venue.swipp.some(item => {
                        return swippGoals.find(goal => goal.target.name === item.target.name)
                    }))
                })
            } else {
                // AND filter: picky, find a venue that has everything requested
                swippVenueList = newVenueList.filter(venue => {
                    return swippGoals.every(goal => {
                        return venue.swipp.find(trade => trade.target.name === goal.target.name)
                    })
                })
            }
        }

        // ---BALDWIN
        let baldwinVenueList: Venue[] = []
        if (goals.baldwin && baldwinGoals.length > 0) {
            if (!picky) {
                // OR filter: not picky, any venue that has at least one item is fine
                baldwinVenueList = newVenueList.filter(venue => {
                    return (venue.baldwin.some(item => {
                        return baldwinGoals.find(goal => goal.target.name === item.target.name)
                    }))
                })
            } else {
                // AND filter: picky, find a venue that has everything requested
                baldwinVenueList = newVenueList.filter(venue => {
                    return baldwinGoals.every(goal => {
                        return venue.baldwin.find(recipe => recipe.target.name === goal.target.name)
                    })
                })
            }
        }

        // ---SCENE
        // this particular filter is not picky (always OR)
        let sceneVenueList: Venue[] = []
        if (goals.scene && sceneGoals.length > 0) {
            sceneVenueList = newVenueList.filter(venue => {
                return sceneGoals.includes(venue.title)
            })
        }

        // ---MERGE FILTERS
        if ((goals.baldwin && baldwinGoals.length > 0) || (goals.swipp && swippGoals.length > 0) || (goals.scene && sceneGoals.length > 0)) {
            if (!picky) {
                // OR filter: not picky, any venue that has at least one item is fine
                newVenueList = []
                newVenueList.push(...swippVenueList)
                newVenueList.push(...baldwinVenueList)
                newVenueList.push(...sceneVenueList)
                newVenueList = [...new Set(newVenueList)]
            } else {
                // AND filter: picky, find a venue that has everything requested
                newVenueList = newVenueList.filter(venue => {
                    let checks = []
                    if (swippVenueList.length > 0) {
                        checks.push(swippVenueList.map(ven => ven.title).includes(venue.title))
                    }
                    if (baldwinVenueList.length > 0) {
                        checks.push(baldwinVenueList.map(ven => ven.title).includes(venue.title))
                    }
                    if (sceneVenueList.length > 0) {
                        checks.push(sceneVenueList.map(ven => ven.title).includes(venue.title))
                    }
                    return checks.every(check => check === true) && checks.length > 0
                })
            }
        }
        
        // ---SORTING
        // sort by food points first
        // totals requested food if multiple are selected
        if (goals.food && foodGoals.length > 0) {
            newVenueList.sort((a, b) => {
                let foodA = 0
                let foodB = 0
                foodGoals.forEach(goal => {
                    foodA += a.food[goal as Food]
                    foodB += b.food[goal as Food]
                })
                return foodB - foodA
            })
        }

        // sort by festival currency
        // this sort will overwrite the food sort
        if (goals.festival && festivalGoal) {
            const element = Object.keys(festivals).find(key => festivals[key as Elements].includes(festivalGoal))
            newVenueList.sort((a, b) => {
                return b.elements[element as Elements].currencyPerHour - a.elements[element as Elements].currencyPerHour
            })   
        }
        setFilteredVenueList(newVenueList)
    }, [
        picky,
        goals,
        festivalGoal,
        foodGoals,
        swippGoals,
        baldwinGoals,
        sceneGoals
    ])

    return error ? <p>{ error }</p> : (
        <main>
            <h1>Coliseum Grinding Guide</h1>
            <div className="box">
                <h2>Advanced Options</h2>
                <label htmlFor="picky">Only show venues that match all criteria.</label>
                <input type="checkbox" name="picky" onChange={ pickyHandler } />
            </div>
            <div className="box">
                <p>
                    The first thing you need to start grinding in the Coliseum is select a venue. There are a lot of them, so let's narrow down your priorities.
                </p>
                <div className="col">
                    <label htmlFor="goal">What's your current grinding target? Feel free to select more than one.</label>
                    <select name="goal" multiple onChange={ (e) => goalHandler(e) }>
                        <option value="festival">Festival</option>
                        <option value="swipp">Swipp Trade</option>
                        <option value="baldwin">Baldwin Recipe</option>
                        <option value="scene">Scene</option>
                        <option value="apparel">Apparel</option>
                        <option value="familiar">Familiar</option>
                        <option value="food">Food</option>
                    </select>
                    { goals.festival && festivalSelect }
                    { goals.swipp && swippSelect }
                    { goals.baldwin && baldwinSelect }
                    { goals.scene && sceneSelect }
                    { goals.apparel && apparelSelect }
                    { goals.familiar && familiarSelect }
                    { goals.food && foodSelect }
                </div>
            </div>
            <div className="row">
                { filteredVenueList.map(venue => {
                    return <Link className="card" href={ `/${ venue.title }` } key={ venue.title }>
                        <h3>{ venue.title }</h3>
                    </Link>
                })}
            </div>
        </main>
    )
}

export default QuestionsPage