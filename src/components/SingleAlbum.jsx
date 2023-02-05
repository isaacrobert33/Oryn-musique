import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    useParams
} from 'react-router-dom';
import Track from './Track';

const SingleAlbum = ({play}) => {
    var token = window.localStorage.getItem("token");
    const {album_id} = useParams();

    const [tracks, setTracks] = useState([]);
    const [album, setAlbum] = useState(null);

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

    async function fetchAlbum() {
        await axios.get(`https://api.spotify.com/v1/albums/${album_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(
                response => {
                    console.log(response)
                    setAlbum(response.data);
                    setTracks(response.data.tracks.items);
                }
            )
    }

    useEffect(
        (e) => {
            if (!tracks.length > 0) {
                fetchAlbum();
            }
            
        }
    )
    return (
        <div className='screen' id='single-playlist'>
            {
                album ? (
                    <>
                        <div className='playlist-back-drop'>
                            <img width={"280px"} height={"280px"} src={album.images[0].url} alt={album.id}/>
                            <h1>{album.name}</h1><br></br>
                            <span>{`${album.tracks.total} songs`}</span>
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
                                                        play(e, track_data.uri)
                                                    )}
                                                    key={track_data.id} id={track_data.id} cover_art={album.images[0].url} 
                                                    title={track_data.name} artist={track_data.artists[0].name} duration={track_data.duration_ms}
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

export default SingleAlbum;