import React from "react"

const DisplayCard = ({id, name, cover_art, link, sub_info=[]}) => {

    return (
        <div key={id} className='album'>
            <a href={link} target={"_blank"}>
                <img width={"196px"} height={"196px"} src={cover_art} alt={cover_art}></img>
                <b>{name}</b><br></br>
                {sub_info.map(
                    (artist) => (
                        <i>{artist.name} </i>
                    )
                )}
                
            </a>
        </div>
    )
}

export default DisplayCard;