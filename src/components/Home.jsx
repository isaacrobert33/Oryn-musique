import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DisplayCard from './DisplayCard';

const Home = ({player, device_id}) => {
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    var token = window.localStorage.getItem("token");
    const fetchAlbums = async () => {
        console.log("tok", token)
        const {data} = await axios.get("https://api.spotify.com/v1/me/albums", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                market: "ES",
                limit: 10,
            }
        })
        
        setAlbums(data.items);
    }

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
        if (!albums.length>0) {
            fetchAlbums();
        }
        if (!playlists.length>0) {
            fetchPlaylists()
        }
    }, [albums, playlists])

    return (
        <div className='screen' id='home'>
            <h1 id='recent-h'>Recents</h1>
            <div className='container'>
                {
                    token ? (
                        albums?.length > 0 ? (
                            albums.map(
                                (album) => (
                                    <DisplayCard key={album.album.id} id={album.album.id} name={album.album.name} cover_art={album.album.images[0].url} link={`/album/${album.album.id}`} artists={album.album.artists}/>
                                )
                            )
                        ) : (
                            <h4>Please check your internet connection</h4>
                        )
                    ) : (
                        <h4>Please sign in your Spotify account</h4>
                    )
                    
                }
            </div>
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

export default Home;