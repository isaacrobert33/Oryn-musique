import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Album = ({name, cover_art, link, artists}) => {

    return (
        <div className='album'>
            <a href={link} target={"_blank"}>
                <img width={"196px"} height={"196px"} src={cover_art} alt={cover_art}></img>
                <b>{name}</b><br></br>
                {artists.map(
                    (artist) => (
                        <i>{artist.name} </i>
                    )
                )}
                
            </a>
        </div>
    )
}

const Home = ({ token }) => {
    const [albums, setAlbums] = useState([]);
    const fetchAlbums = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me/albums", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                market: "ES",
                limit: 10,
            }
        })
        console.log(data);
        setAlbums(data.items);
    }

    useEffect(() => {
        console.log("home", token);
        fetchAlbums();
    })

    return (
        <div className='screen' id='home'>
            <h2>Recents</h2>
            <div className='recents'>
                {
                    token ? (
                        albums?.length > 0 ? (
                            albums.map(
                                (album) => (
                                    <Album name={album.album.name} cover_art={album.album.images[0].url} link={album.album.href} artists={album.album.artists}/>
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
        </div>
    )
}

export default Home;