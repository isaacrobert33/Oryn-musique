import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Link,
    useParams
} from 'react-router-dom';

const Track = ({id, cover_art, title, artist, duration, play_callback}) => {
    let duration_sec = duration/1000;
    let duration_min = parseInt(duration_sec/60);
    let duration_rm = Math.ceil(duration_sec%60);
    return (
        <li key={id} className='track' onClick={play_callback} >
            <div className='track-play'>►</div>

            <img width={"48px"} height={"48px"} className='track-art' src={cover_art} alt={id}></img>
            
            <span className='track-title'>{title}</span>
            <span className='track-artist'>{artist}</span>

            <span className='track-duration'>{`${duration_min}:${duration_rm}`}</span>
        </li>
    )
}

const SinglePlaylist = ({play}) => {
    var token = window.localStorage.getItem("token");
    const {playlist_id} = useParams();

    const [tracks, setTracks] = useState([]);
    const [playlist, setPlaylist] = useState(null);

    // async function fetchTracks() {
    //     await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         .then(
    //             response => {
    //                 console.log(response);
    //                 setTracks(response.data.items);
    //             }
    //         )
    // }

    async function fetchPlaylist() {
        await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(
                response => {
                    console.log(response)
                    setPlaylist(response.data);
                    setTracks(response.data.tracks.items);
                }
            )
    }

    useEffect(
        (e) => {
            if (!tracks.length > 0) {
                fetchPlaylist();
                // fetchTracks();
            }
            
        }
    )
    return (
        <div className='screen' id='single-playlist'>
            {
                playlist ? (
                    <>
                        <div className='playlist-back-drop'>
                            <img width={"280px"} height={"280px"} src={playlist.images[0].url} alt={playlist.id}/>
                            <h1>{playlist.name}</h1><br></br>
                            <span>{`${playlist.tracks.total} songs`}</span>
                        </div>
                        <div className='tracks'>
                                <div className='tracks-heading'>
                                    <span className='track-title'>TITLE</span>
                                    <span className='track-artist'>ARTIST</span>
                                    <span className='track-duration'>DURATION</span>
                                </div>
                                
                                <ul className="track-list">
                                
                                {
                                    tracks?.length > 0 ? (
                                        tracks.map(
                                            track_data => (
                                                <Track 
                                                    play_callback={e => (
                                                        play(e, track_data.track.uri)
                                                    )}
                                                    key={track_data.track.id} id={track_data.track.id} cover_art={track_data.track.album.images[0].url} 
                                                    title={track_data.track.name} artist={track_data.track.artists[0].name} duration={track_data.track.duration_ms}
                                                    />
                                            )
                                        )
                                    ) : (
                                        <i>No track in this playlist</i>
                                    )
                                }
                            </ul>
                        </div>
                    </>
                ) : (
                    <></>
                )
            }
            
        </div>
    )
}

export default SinglePlaylist;