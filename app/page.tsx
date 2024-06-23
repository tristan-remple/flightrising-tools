import Link from "next/link"

const Landing = () => {
    return (
        <main>
            <h1>AquaLunae's Flight Rising Tools</h1>
            <div className="row">
                <Link className="tile" href="/coliseum">
                    <img className="tile-icon" src="img/coliseum-umbel.png" alt="Some crumbling ruins" />
                    <h2>Coliseum</h2>
                </Link>
            </div>
        </main>
    )
}

export default Landing