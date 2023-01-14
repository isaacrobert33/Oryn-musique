import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import DisplayCard from './DisplayCard';

const Playlist = () => {
    const [playlists, setPlaylists] = useState([]);
    var token = window.localStorage.getItem("token");

    const fetchPlaylists = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me/playlists", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                market: "ES",
                limit: 10,
            }
        })
        console.log(data);
        setPlaylists(data.items);
    }

    useEffect(() => {
        if (!playlists.length>0) {
            fetchPlaylists()
        }
    }, [playlists])

    return (
        <div className='screen' id='playlist'>
            <h1>Playlists</h1>
            <div className='container'>
                {
                    playlists?.length > 0 ? (
                        playlists.map(
                            (pl) => (
                                <DisplayCard key={pl.id}  name={pl.name} cover_art={pl.images[0].url} link={pl.href} />
                            )
                        )
                    ) : (
                        <div>No recorded playlists</div>
                    )
                }
            </div>
        </div>
    )
}

export default Playlist;