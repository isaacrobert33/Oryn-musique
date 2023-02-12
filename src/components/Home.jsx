import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DisplayCard from './DisplayCard';

const Home = ({player, device_id}) => {
    const CLIENT_ID = "f8453497694c4440b8458f0182f51618";
    const REDIRECT_URI = document.location.href.slice(0, -1);
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPES = "user-read-playback-position,user-library-read,user-read-playback-state,user-modify-playback-state,user-read-currently-playing,user-read-recently-played,user-read-playback-position,streaming,app-remote-control"
    const SIGNIN_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`
    
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
        token = window.localStorage.getItem("token");
        
        if (!albums.length>0 && token) {
            fetchAlbums();
        }
        if (!playlists.length>0 && token) {
            fetchPlaylists()
        }
    }, [albums, playlists])

    return (
        <div className='screen' id='home'>
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
                        <>
                            <span id='cloud-err'></span>
                            <h4>Please <a href={SIGNIN_URL}>sign in</a> your Spotify account</h4>
                        </>
                        
                    )
                    
                }
                {
                    playlists?.length > 0 ? (
                        playlists.map(
                            (pl) => (
                                <DisplayCard key={pl.id}  name={pl.name} cover_art={pl.images[0].url} link={`/playlist/${pl.id}`} />
                            )
                        )
                    ) : (
                        <></>
                    )
                }
            </div>
        </div>
    )
}

export default Home;