import axios from 'axios';
import React, {useState, useEffect} from 'react';
import DisplayCard from './DisplayCard';

const Albums = () => {
    const [albums, setAlbums] = useState([]);
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

    useEffect(() => {
        if (!albums.length>0) {
            fetchAlbums();
        }
        
    }, [albums])

    return (
        <div className='screen' id='albums'>
            <h1>Albums</h1>
            <div className='container'>
                {
                    token ? (
                        albums?.length > 0 ? (
                            albums.map(
                                (album) => (
                                    <DisplayCard key={album.album.id} name={album.album.name} cover_art={album.album.images[0].url} link={album.album.href} artists={album.album.artists}/>
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

export default Albums;