import axios from 'axios';
import React, { useEffect, useState } from 'react';
import search_icon from './assets/search-noir.svg';
import AlbumCard from './AlbumCard';

const MusiCard = ({id, name, cover_art, link, uri, sub_info=[], play_track, canplay=true}) => {
    return (
        <div key={id} className='music-card'>
            {
                canplay ? (<span className='play-btn' onClick={(e) => (play_track(e, [uri]))}>►</span>) : (<></>)
            }
            <a onClick={(e) => (play_track(e, [uri]))} className='music-card-link' rel="noreferrer">
                <img src={cover_art} alt={cover_art}></img>
                <b>{name}</b>
                <i>
                    {
                        sub_info.map(
                            (artist) => (
                                `${artist.name}, `
                            )
                        )
                    }
                </i>
                <span className='badge'>{"Track"}</span>
            </a>
        </div>
    )
}

const Search = ({player, updateStatus}) => {
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchHeading, setHeading] = useState("Recent searches");
    const [offset, setOffset] = useState(0);
    const [hasMore, setHas] = useState(false);
    const [total, setTotal] = useState(0);
    
    var token = window.localStorage.getItem("token");
    const fetchCategories = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/browse/categories", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(data);
        setCategories(data.categories.items)

    }
    
    async function recentSearch(q) {
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                type: "track,album",
                q: q,
                limit: 4
            }
        });
        
        setResults(data.tracks.items)
    }
    var timeID;
    const inputQ = () => {
        clearTimeout(timeID);
        timeID = setTimeout(search, 1200)
    }

    const search = async (e, _offset_=null) => {
        let keyword = document.getElementById("keyword").value;
        let search_offset = offset;
        
        if (_offset_ !== null) {
            search_offset = _offset_;
        }
        if (!keyword) {
            setHeading("Recent searches");
            setResults([]);
            return;
        }
        
        setHeading(`Top Results for "${keyword}":`);
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                type: "album,track",
                q: keyword,
                limit: 8,
                offset: search_offset
            }
        }).then(
            response => {
                let result_data = [...response.data.tracks.items, ...response.data.albums.items];
                console.log(result_data);
                setResults(result_data);
                setTotal(response.data.tracks.total+response.data.albums.total);

                if (offset < data.tracks.total) {
                    setHas(true);
                } else {
                    setHas(false);
                }
            }
        )

    }

    function navBack() {
        let n_offset = offset - 11;
        setOffset(n_offset);
        search({}, n_offset);
    }

    function navForward() {
        let n_offset;
        if (offset < total) {
            n_offset = offset + 11;
            setOffset(n_offset);
            setHas(true);
        } else {
            setHas(false);
            n_offset = offset;
        }
        search({}, n_offset);
    }

    useEffect(() => {
        if (!categories.length>0) {
            fetchCategories();
        }
        let recent_search = window.localStorage.getItem("recent_search");
        if (!results.length > 0) {
            recentSearch(recent_search);
        }
        document.getElementById("user").style.display = "none";
    }, [results, categories])
    
    return (
        <div className='screen' id='search'>
            {
                offset > 0 ? (
                    <span onClick={navBack} id='prev' className='pagination' title='previous'>
                        &#8249;
                    </span>
                ) : (
                    <></>
                )
            }
            {
                hasMore ? (
                    <span onClick={navForward} id='next' className='pagination' title='next'>
                        &#8250;
                    </span>
                ) : (
                    <></>
                )
            }
            
            <div id={"search-bar"}>
                <img id='search-icon' src={search_icon} alt={"search"}/>
                <input id='keyword' onChange={inputQ} type={"text"} placeholder={"What do you want to listen to?"}/>
            </div>
            <h2>{searchHeading}</h2>
            <div className='search-results'>
                {
                    results?.length > 0 ? (
                        results.map(
                            (res) => (
                                res.type == "track" ? (
                                    <MusiCard key={res.id} id={res.id} name={res.name.length < 22 ? res.name : `${res.name.slice(0, 23)}...`} sub_info={res.artists} cover_art={res.album.images[0].url} uri={res.uri} play_track={player}/>
                                ) : (
                                    <AlbumCard key={res.id} id={res.id} name={res.name.length < 22 ? res.name : `${res.name.slice(0, 23)}...`} cover_art={res.images[0].url} link={`/album/${res.id}`} artists={res.artists}/>
                                )
                            )
                        )
                        
                    ) : (
                        <div>No matches found!</div>
                    )
                }
            </div>
            <h2>Browse Category</h2>
            <div className='search-results'>
                {
                    categories?.length > 0 ? (
                        categories.map(
                            (catg) => (
                                <MusiCard key={catg.id} id={catg.id} name={catg.name} cover_art={catg.icons[0].url} link={catg.href} canplay={false}/>
                                
                            )
                        )
                    ) : (
                        <div>No categories found!</div>
                    )
                }
            </div>
            
        </div>
    )
}

export default Search;