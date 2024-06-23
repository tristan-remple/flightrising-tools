"use client"

import { useEffect, useState } from "react"

import { Venue } from "@/app/models/venue"
import { Food } from "@/app/models/enums"

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

    const convertBool = (bool?: boolean) => {
        if (bool) { return "Yes" }
        else { return "No" }
    }

    return error ? <p>{ error }</p> : (
        <main>
            <h1>{ venue?.title }</h1>
            <img className="background" src={ `/img/${ venue?.title } Day.png` } />
            <div className="row">
                <div className="box half">
                    <h2>Overview</h2>
                    <table className="overview">
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
                            <td><strong>Food:</strong></td>
                            <td>
                                <table className="wide">
                                    <tr><td><strong>Total:</strong></td><td>{ details.totalFood }</td></tr>
                                    <tr><td><strong>Insects:</strong></td><td>{ venue?.food.insect }</td></tr>
                                    <tr><td><strong>Meat:</strong></td><td>{ venue?.food.meat }</td></tr>
                                    <tr><td><strong>Seafood:</strong></td><td>{ venue?.food.seafood }</td></tr>
                                    <tr><td><strong>Plants:</strong></td><td>{ venue?.food.plant }</td></tr>
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
                            <td><strong>Enemies:</strong></td>
                            <td>{ details.enemyCount }</td>
                            <td><div className="btn small">Focus</div></td>
                        </tr>
                        <tr>
                            <td><strong>Fiona Familiars:</strong></td>
                            <td>{ details.fionaCount }</td>
                            <td>{ details.fionaCount > 0 && <div className="btn small">Focus</div> }</td>
                        </tr>

                        <tr>
                            <td><strong>Swipp Items:</strong></td>
                            <td>{ details.swippCount }</td>
                            <td><div className="btn small">Focus</div></td>
                        </tr>
                        <tr>
                            <td><strong>Baldwin Items:</strong></td>
                            <td>{ details.baldwinCount }</td>
                            <td><div className="btn small">Focus</div></td>
                        </tr>
                        <tr>
                            <td><strong>Unique Apparel:</strong></td>
                            <td>{ details.apparelCount }</td>
                            <td><div className="btn small">Focus</div></td>
                        </tr>
                        <tr>
                            <td><strong>Scene Drop:</strong></td>
                            <td>{ convertBool(venue?.scene) }</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div className="box half">

                </div>
            </div>
        </main>
    )
}

export default VenuePage