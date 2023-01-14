import axios from 'axios';
import React, { useEffect, useState } from 'react';
import search_icon from './assets/search-noir.svg';

const MusiCard = ({key, name, cover_art, link, sub_info=[]}) => {

    return (
        <div key={key} className='music-card'>
            <a href={link} target={"_blank"}>
                <img width={"196px"} height={"196px"} src={cover_art} alt={cover_art}></img>
                <b>{name}</b>
                <br></br>
                {sub_info.map(
                    (artist) => (
                        <i>{artist.name} </i>
                    )
                )}
                
            </a>
        </div>
    )
}

const Search = () => {
    const [results, setResults] = useState([]);
    const [searchKeyword, setKeyword] = useState("");
    var token = window.localStorage.getItem("token");
    const search = async () => {
        let keyword = document.getElementById("keyword").value;
        setKeyword(keyword);
        if (!keyword) {
            setResults([]);
            return;
        }
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                type: "track",
                q: keyword
            }
        });

        setResults(data.tracks.items)
    }
    
    return (
        <div className='screen' id='search'>
            <div id={"search-bar"}>
                <img id='search-icon' src={search_icon} alt={"search"}/>
                <input id='keyword' onChange={search} type={"text"} placeholder={"What do you want to listen to?"}/>
            </div>
            <h2>Top Results for "{searchKeyword}":</h2>
            <div className='search-results'>
                {
                    results?.length > 0 ? (
                        results.map(
                            (res) => (
                                <MusiCard name={res.name} sub_info={res.artists} cover_art={res.album.images[0].url}/>
                            )
                        )
                        
                    ) : (
                        <div>No matches found!</div>
                    )
                }
            </div>
        </div>
    )
}

export default Search;