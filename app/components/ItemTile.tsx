import { Item } from "../models/venue"

interface Props {
    item: Item,
    handleClick: (id:number) => void
}

const ItemTile = ({ item, handleClick }: Props) => {
    return <div className="item" onClick={ () => handleClick(item.id) } key={ item.id } >
        <img className="item-icon" src={ `/img/icons/${ item.name }.png` } />
        <p className="item-label">{ item.name }</p>
    </div>
}

export default ItemTile