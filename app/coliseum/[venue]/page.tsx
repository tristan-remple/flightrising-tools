"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Familiar, Venue } from "@/app/models/venue"
import { Food } from "@/app/models/enums"
import ItemTile from "@/app/components/ItemTile"

interface ApiResponse {
    success: boolean,
    venue?: Venue,
    error?: any
}

interface Props {
    params: {
        venue: string
    }
}

const VenuePage = ({ params }: Props) => {

    // ---SETUP
    // fetch and distribute initial data
    const [ error, setError ] = useState<string | null>("Loading...")
    const [ venue, setVenue ] = useState<Venue>()
    const [ details, setDetails ] = useState({
        bosses: false,
        enemyCount: 0,
        totalFood: 0,
        fionaCount: 0,
        swippCount: 0,
        baldwinCount: 0,
        apparelCount: 0
    })
    useEffect(() => {
        (async() => {
            try {
                const response = await fetch(`/data/${ params.venue }`)
                const data: ApiResponse = await response.json()
                setVenue(data.venue)
                const bosses = data.venue?.familiars.some(fam => fam.boss) || false
                const enemyCount = data.venue?.familiars.length || 0
                let totalFood = 0
                for (let foodType in data.venue?.food) {
                    totalFood += data.venue?.food[foodType as Food]
                }
                const fionaCount = data.venue?.familiars.filter(fam => fam.fiona).length || 0
                const swippCount = data.venue?.swipp.length || 0
                const baldwinCount = data.venue?.baldwin.length || 0
                const apparelCount = data.venue?.apparel.length || 0
                const newDetails = {
                    bosses, enemyCount, totalFood, fionaCount, swippCount, baldwinCount, apparelCount
                }
                setDetails(newDetails)
                setError(null)
            } catch(err) {
                setError("Data not available.")
            }
        })()
    }, [])

    // Helper function for displaying booleans prettily
    const convertBool = (bool?: boolean) => {
        if (bool) { return "Yes" }
        else { return "No" }
    }

    // this will need to be changed if/when I add a real database and users
    // changes the appearance of checkboxes
    const toggleCheck = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        if (target.classList.contains("checked")) {
            target.classList.remove("checked")
        } else {
            target.classList.add("checked")
        }
    }

    // feature is the type of item being focused on
    // ex: familiars, swipp
    const [ feature, setFeature ] = useState<string | null>(null)

    // ---FAMILIARS
    // focus familiars show up at the top of the column
    // they display more details than the tiles below
    const [ focusFamiliarList, setFocusFamiliarList ] = useState<Familiar[]>([])
    const showFamiliarDetails = (familiarId: number) => {
        const newFFList = [...focusFamiliarList]
        const familiar = venue?.familiars.find(fam => fam.item.id === familiarId)
        if (familiar && !newFFList.find(fam => fam.item.id === familiar.item.id)) {
            newFFList.push(familiar)
            newFFList.sort((a, b) => a.item.name.localeCompare(b.item.name))
            setFocusFamiliarList(newFFList)
        }
    }

    // add and remove familiar focus
    const removeFamiliarFocus = (familiarId: number) => {
        const newFFList = [...focusFamiliarList].filter(fam => {
            return fam.item.id !== familiarId
        })
        setFocusFamiliarList(newFFList)
    }
    const focusAllFamiliars = () => {
        const allFamiliars = venue?.familiars.sort((a, b) => a.item.name.localeCompare(b.item.name)) || []
        setFocusFamiliarList(allFamiliars)
    }
    const focusNoFamiliars = () => {
        setFocusFamiliarList([])
    }
    const fionaFamiliars = venue?.familiars.filter(fam => fam.fiona) || []
    const focusFiona = () => {
        setFocusFamiliarList(fionaFamiliars)
    }

    // display focused familiars
    const displayFocusFamiliars = <table>
        <thead>
            <tr>
                <td>Icon</td>
                <td>Name</td>
                <td>Boss</td>
                <td>Fiona</td>
                {/* <td>Obtained</td> */}
                <td>Encyclopedia</td>
                <td>Remove</td>
            </tr>
        </thead>
        <tbody>
            { focusFamiliarList.map(fam => {
                return <tr key={ fam.item.id }>
                    <td><img className="item-mini" src={ `/img/icons/${ fam.item.name }.png` } /></td>
                    <td>{ fam.item.name }</td>
                    <td>{ convertBool(fam.boss) }</td>
                    <td>{ convertBool(fam.fiona) }</td>
                    {/* <td><div className="checkbox" onClick={ (e) => toggleCheck(e) }></div></td> */}
                    <td><Link className="btn small" href={ `https://www1.flightrising.com/game-database/item/${ fam.item.id }` }>Link</Link></td>
                    <td><div className="square-btn" onClick={ () => removeFamiliarFocus(fam.item.id) }>✘</div></td>
                </tr>
            })}
        </tbody>
    </table>

    // display familiars
    const displayFamiliars = <>
        <h2>Familiars</h2>
        <h3>Focus</h3>
        <div className="row row-3btn">
            <div className="btn" onClick={ focusAllFamiliars } >Focus All</div>
            <div className="btn" onClick={ focusNoFamiliars } >Focus None</div>
            <div className="btn" onClick={ focusFiona } >Focus Fiona</div>
        </div>
        { focusFamiliarList.length > 0 && displayFocusFamiliars }
        <h3>All</h3>
        <div className="row">
            { venue?.familiars.map(fam => {
                return <ItemTile item={ fam.item } handleClick={ showFamiliarDetails } />
            })}
        </div>
    </>

    const displaySwipp = <>
        <h2>Swipp Trades</h2>
    </>

    const displayBaldwin = <>
        <h2>Baldwin Recipes</h2>
    </>

    const displayApparel = <>
        <h2>Apparel Drops</h2>
    </>

    return error ? <p>{ error }</p> : (
        <main>
            <h1>{ venue?.title }</h1>
            <img className="background" src={ `/img/${ venue?.title } Day.png` } />
            <div className="row">
                <div className="box half">
                    <h2>Overview</h2>
                    <table className="overview">
                        <tbody>
                            { venue?.startingLevel === venue?.endingLevel ?
                                <tr><td><strong>Level:</strong></td><td>{ venue?.startingLevel }</td><td></td></tr> :
                                <tr><td><strong>Levels:</strong></td><td>{ venue?.startingLevel }-{ venue?.endingLevel }</td><td></td></tr>
                            }
                            <tr>
                                <td><strong>Exalt Grinding:</strong></td>
                                <td>{ convertBool(venue?.exaltTraining) }</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="text-top"><strong>Food:</strong></td>
                                <td>
                                    <table className="wide inner">
                                        <tbody>
                                            <tr><td><strong>Total:</strong></td><td>{ details.totalFood }</td></tr>
                                            <tr><td><strong>Insects:</strong></td><td>{ venue?.food.insect }</td></tr>
                                            <tr><td><strong>Meat:</strong></td><td>{ venue?.food.meat }</td></tr>
                                            <tr><td><strong>Seafood:</strong></td><td>{ venue?.food.seafood }</td></tr>
                                            <tr><td><strong>Plants:</strong></td><td>{ venue?.food.plant }</td></tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><strong>Bosses:</strong>
                                </td><td>{convertBool(details.bosses) }</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><strong>Familiars:</strong></td>
                                <td>{ details.enemyCount }</td>
                                <td><div className="btn small" onClick={ () => setFeature("familiars") } >Focus</div></td>
                            </tr>
                            <tr>
                                <td><strong>Fiona Familiars:</strong></td>
                                <td>{ details.fionaCount }</td>
                                <td>{ details.fionaCount > 0 && <div className="btn small"  onClick={ () => {
                                    setFeature("familiars")
                                    focusFiona()
                                }} >Focus</div> }</td>
                            </tr>

                            <tr>
                                <td><strong>Swipp Trades:</strong></td>
                                <td>{ details.swippCount }</td>
                                <td><div className="btn small" onClick={ () => setFeature("swipp") } >Focus</div></td>
                            </tr>
                            <tr>
                                <td><strong>Baldwin Recipes:</strong></td>
                                <td>{ details.baldwinCount }</td>
                                <td><div className="btn small" onClick={ () => setFeature("baldwin") } >Focus</div></td>
                            </tr>
                            <tr>
                                <td><strong>Unique Apparel:</strong></td>
                                <td>{ details.apparelCount }</td>
                                <td><div className="btn small" onClick={ () => setFeature("apparel") } >Focus</div></td>
                            </tr>
                            <tr>
                                <td><strong>Scene Drop:</strong></td>
                                <td>{ convertBool(venue?.scene) }</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <Link className="btn" href="/coliseum">Return to List</Link>
                </div>
                <div className="box half">
                    { feature === "familiars" && displayFamiliars }
                    { feature === "swipp" && displaySwipp }
                    { feature === "baldwin" && displayBaldwin }
                    { feature === "apparel" && displayApparel }
                </div>
            </div>
        </main>
    )
}

export default VenuePage