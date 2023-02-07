import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    useParams
} from 'react-router-dom';
import Track from './Track';

const SinglePlaylist = ({play}) => {
    var token = window.localStorage.getItem("token");
    const {playlist_id} = useParams();

    const [tracks, setTracks] = useState([]);
    const [playlist, setPlaylist] = useState(null);
    const [URI, setURI] = useState([]);

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
                    let track_items = response.data.tracks.items;
                    let uris = [];
                    for (let i=0; i<track_items.length; i++) {
                        uris.push(track_items[i].uri);
                    }

                    setPlaylist(response.data);
                    setTracks(track_items);
                    setURI(uris);
                    console.log(uris);
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
                            <span>{`${playlist.tracks.total} songs`} • {`${playlist.release_date.split("-")[0]}`}</span>
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
                                                        play(e, URI.slice(URI.indexOf(track_data.uri)))
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