import { NextRequest, NextResponse } from "next/server"
import fs from 'node:fs'

export async function GET(req: NextRequest) {
    try {
        const venues = fs.readFileSync("./app/data/venues.json", {
            encoding: "utf8"
        })
        return new NextResponse(JSON.stringify({ success: true, venues: JSON.parse(venues) }))
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ success: false, error: error }))
    }
}