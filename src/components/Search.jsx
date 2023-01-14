import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import search_icon from './assets/search-noir.svg';
import DisplayCard from './DisplayCard';

const Search = () => {
    const [results, setResults] = useState([]);
    const [searchKeyword, setKeyword] = useState("");

    const Search = async () => {
        let token = window.localStorage.getItem("token");
        const {data} = axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearers ${token}`
            },
            params: {
                type: "track",
                q: searchKeyword
            }
        });

        setResults(data.tracks.items)
    }
    return (
        <div className='screen' id='search'>
            <div id={"search-bar"}>
                <img src={search_icon} alt={"search"}/>
                <input type={"text"} placeholder={"What do you want to listen to?"}/>
            </div>
            <div className='search-results'>
                {
                    results?.length > 0 ? (
                        results.map(
                            (res) => (
                                <DisplayCard />
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