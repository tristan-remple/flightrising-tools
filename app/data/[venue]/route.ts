import { NextRequest, NextResponse } from "next/server"

import fs from 'fs'
import { Venue } from "@/app/models/venue"

interface Props {
    params: {
        venue: string
    }
}

export async function GET(
    req: NextRequest,
    props: Props
) {
    try {
        const { venue } = props.params
        const venues = fs.readFileSync("./app/data/venues.json", {
            encoding: "utf8"
        })
        const parsedVenues = JSON.parse(venues)
        const oneVenue = parsedVenues.filter((v: Venue) => {
            return v.title === venue
        })[0]
        return new NextResponse(JSON.stringify({ success: true, venue: oneVenue }))
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ success: false, error: error }))
    }
}