import React from "react"
import { Link } from 'react-router-dom';

const DisplayCard = ({id, name, cover_art, link, sub_info=[]}) => {

    return (
        <div key={id} className='album'>
            <Link to={link}>
                <img width={"196px"} height={"196px"} src={cover_art} alt={cover_art}></img>
                <b>{name}</b><br></br>
                {sub_info.map(
                    (artist) => (
                        <i>{artist.name} </i>
                    )
                )}
                
            </Link>
        </div>
    )
}

export default DisplayCard;