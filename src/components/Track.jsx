import React, { useEffect, useState } from 'react';

const Track = ({id, cover_art, title, artist, duration, play_callback}) => {
    let duration_sec = duration/1000;
    let duration_min = parseInt(duration_sec/60);
    let duration_rm = Math.ceil(duration_sec%60);
    return (
        <li key={id} className='track' onClick={play_callback} >
            <div className='track-play'>►</div>

            <img width={"48px"} height={"48px"} className='track-art' src={cover_art} alt={id}></img>
            <div className='track-detail'>
                <span className='track-title'><b>{title.length < 21 ? title: `${title.slice(0, 22)}...`}</b></span><br></br>
                <span className='track-artist'>{artist}</span>
            </div>

            <span className='track-duration'>{`${duration_min}:${duration_rm}`}</span>
        </li>
    )
}

export default Track;