"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { CombinationItem, Familiar, Venue } from "@/app/models/venue"
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
    // focus items show up at the top of the column
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
                return <ItemTile item={ fam.item } handleClick={ showFamiliarDetails } key={ fam.item.id } />
            })}
        </div>
    </>

    // ---SWIPP

    // focus items show up at the top of the column
    // they display more details than the tiles below
    const [ swippFocusList, setSwippFocusList ] = useState<CombinationItem[]>([])
    const showSwippItem = (itemId: number) => {
        const newSwippFocus = [...swippFocusList]
        const swippItem = venue?.swipp.filter(trade => trade.item.id === itemId)
        if (swippItem && !newSwippFocus.find(trade => {
            return (trade.item.id === swippItem[0].item.id)
        })) {
            newSwippFocus.push(...swippItem)
            newSwippFocus.sort((a, b) => {
                return a.item.name.localeCompare(b.item.name)
            })
            setSwippFocusList(newSwippFocus)
        }
    }
    const showSwippTarget = (id: number) => {
        return
    }

    const focusAllSwipp = () => {
        const allSwipp = venue?.swipp.sort((a, b) => {
            return a.item.name.localeCompare(b.item.name)
        }) || []
        setSwippFocusList(allSwipp)
    }
    const focusNoSwipp = () => {
        setSwippFocusList([])
    }
    const removeSwippFocus = (itemId: number, targetId: number) => {
        const newSwippFocus = [...swippFocusList].filter(trade => {
            return trade.target.id !== targetId || trade.item.id !== itemId
        })
        setSwippFocusList(newSwippFocus)
    }

    // the mode can be set to display target items or gathered materials
    const [ swippMode, setSwippMode ] = useState("Requested Item")
    const switchMode = () => {
        const newMode = swippMode === "Requested Item" ? "Trade Goal" : "Requested Item"
        setSwippMode(newMode)
    }

    const displayFocusTrades = <table>
        <thead>
            <tr>
                <td colSpan={ 2 }>Trade-in Item</td>
                <td>Required</td>
                <td>Drops From</td>
                <td colSpan={ 2 }>Target Item</td>
                <td colSpan={ 3 }>Other Requirements</td>
                <td>Remove</td>
            </tr>
        </thead>
        <tbody>
            { swippFocusList.map(trade => {

                let otherReq = trade.otherRequirements.map(req => {
                    return <td key={ req.item.id }><img className="item-mini" src={ `/img/icons/${ req.item.name }.png` } /></td>
                })
                for (let cap = otherReq.length; cap < 3; cap++) {
                    otherReq.push(<td key={ `${ trade.item.id }-${ trade.target.id }-${ cap }` }></td>)
                }

                return <tr key={ `${trade.item.id}-${trade.target.id}` }>
                    <td><img className="item-mini" src={ `/img/icons/${ trade.item.name }.png` } /></td>
                    <td>{ trade.item.name }</td>
                    <td>{ trade.numberRequired }</td>
                    <td><img className="item-mini" src={ `/img/icons/${ trade.dropsFrom[0] }.png` } /></td>
                    <td><img className="item-mini" src={ `/img/icons/${ trade.target.name }.png` } /></td>
                    <td>{ trade.target.name }</td>
                    { otherReq }
                    <td><div className="square-btn" onClick={ () => removeSwippFocus(trade.item.id, trade.target.id) }>✘</div></td>
                </tr>
            })}
        </tbody>
    </table>
    const displaySwipp = <>
        <h2>Swipp Trades</h2>
        <strong>Current Mode:</strong> { swippMode } <div className="btn" onClick={ switchMode } >Switch</div>
        <h3>Focus</h3>
        <div className="row row-3btn">
            <div className="btn" onClick={ focusAllSwipp } >Focus All</div>
            <div className="btn" onClick={ focusNoSwipp } >Focus None</div>
        </div>
        { swippFocusList.length > 0 && displayFocusTrades }
        <h3>All</h3>
        <div className="row">
            { swippMode === "Requested Item" ? venue?.swipp.reduce((list: CombinationItem[], trade) => {
                if (!list.find(item => item.item.id === trade.item.id)) {
                    list.push(trade)
                }
                return list
            }, []).sort((a, b) => {
                return a.item.name.localeCompare(b.item.name)
            }).map(trade => {
                return <ItemTile item={ trade.item } handleClick={ showSwippItem } key={ `${trade.item.id}-${trade.target.id}` } />
            }) : venue?.swipp.sort((a, b) => {
                return a.item.name.localeCompare(b.item.name)
            }).map(trade => {
                return <ItemTile item={ trade.target } handleClick={ showSwippTarget } key={ `${trade.item.id}-${trade.target.id}` } />
            }) }
        </div>
    </>

    const displayBaldwin = <>
        <h2>Baldwin Recipes</h2>
    </>

    const dontHandleClick = (id: number) => {
        return
    }
    const displayApparel = <>
        <h2>Apparel Drops</h2>
        <div className="row">
            { venue?.apparel.map(piece => {
                return <ItemTile item={ piece } handleClick={ dontHandleClick } key={ piece.id } />
            })}
        </div>
    </>

    return error ? <p>{ error }</p> : (
        <main>
            <h1>{ venue?.title }</h1>
            <img className="background" src={ `/img/${ venue?.title } Day.png` } />
            <div className="box wide">
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
            <div className="box wide">
                { feature === "familiars" && displayFamiliars }
                { feature === "swipp" && displaySwipp }
                { feature === "baldwin" && displayBaldwin }
                { feature === "apparel" && displayApparel }
            </div>
        </main>
    )
}

export default VenuePage