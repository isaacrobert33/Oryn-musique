import React from "react";
import { Link } from "react-router-dom";

const AlbumCard = ({id, name, cover_art, link, uri, sub_info=[], play_track, canplay=false}) => {
    return (
        <div key={id} className="album-card">
            {
                canplay ? (<span className='play-btn' onClick={(e) => (play_track(e, [uri]))}>►</span>) : (<></>)
            }
            <Link className='music-card-link' to={link}>
                <img src={cover_art} alt={cover_art}></img>
                <b>{name}</b>
                <i>
                    {
                        sub_info.map(
                            (artist) => (
                                `${artist.name}, `
                            )
                        )
                    }
                </i>
                <span className='badge'>{"Album"}</span>
            </Link>
        </div>
    )
}

export default AlbumCard;
