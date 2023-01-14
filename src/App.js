import {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './App.css';
import axios from 'axios';

import Home from './components/Home';
import Search from "./components/Search";
import Playlist from "./components/Playlist";
import Albums from "./components/Albums";
import Artists from "./components/Artists";

import home_icon from './assets/home.svg';
import search_icon from './assets/search-icon.svg';
import playlist_icon from './assets/playlist.svg';
import album_icon from './assets/album.svg';
import oryn from './assets/oryn.svg';
import user_icon from './assets/user.svg';

function App() {
    const CLIENT_ID = "f8453497694c4440b8458f0182f51618"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([]);
    const [userData, setUserData] = useState(null);

    // const getToken = () => {
    //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
    //     let token = urlParams.get('access_token');
    // }

    var logoutShowed = false;
    function showLogout() {
      if (!logoutShowed) {
        document.getElementById("logout").style.display = "block";
        logoutShowed = true;
      } else {
        document.getElementById("logout").style.display = "none";
        logoutShowed = false;
      }
      
    }

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const getUserData = async (token) => {
      let response;
      try {
        response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {Authorization: `Bearer ${token}`}
        })
      } catch (error) {
        console.log("axios error", error);
        logout();
        return;
      }
      
      console.log("status", response.data);
      setUserData(response.data);
    }
      

    const searchArtists = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })

        setArtists(data.artists.items)
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
    }

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token");
        console.log(token);
        console.log(userData);
        // getToken()


        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        getUserData(token);
        setToken(token);

    }, [])
    

    return (
      <Router>
        <div className="App">
          <div className='user'>
            {
              userData ? (
                <a onClick={showLogout}>
                  <img className="user-img" width={"32px"} height={"32px"} src={userData.images[0].url} alt='user' /> 
                  <b>
                    {userData.display_name}
                  </b>
                  <span id="logout" onClick={logout}>Logout</span>
                </a>
              ) : (
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-library-read`}>
                  <img id="no-user-img" className="user-img" width={"32px"} height={"32px"} src={user_icon} alt='user' /> 
                  <b>Sign in</b>
                </a>
                
              )
            }
          </div>
          <div className="sidebar">
            <div className="oryn">
              <Link className={"oryn-link"} to="/">
                <span>
                  <img src={oryn} alt={"oryn"}/>
                </span>
                <b>RYN</b>
              </Link>
            </div>
          
            <ul>
              <li>
                <Link className="tabs" to="/">
                  <span>  
                    <img src={home_icon} alt={"home"}></img>
                  </span>
                  Home
                </Link>
                
              </li>
              <li>
                <Link className="tabs" to="/search">
                  <span>
                  <img src={search_icon} alt={"search"}/>
                  </span>
                  Search
                </Link>
                
              </li>
              <li>
                <Link className="tabs" to="/playlists">
                  <span>
                    <img src={playlist_icon} alt={"playlist"}/>
                  </span>
                  Playlist
                </Link>
              </li>
              <li>
                <Link className="tabs" to="/albums">
                  <span>
                    <img src={album_icon} alt={"albums"}/> 
                  </span>
                  Albums
                </Link>
              </li>
              <li>
                <Link className="tabs" to="/artists">
                  Artists
                </Link>
              </li>
            </ul>
          </div>
          <Routes>
            <Route exact path='/' element={<Home />}></Route>
            <Route exact path='/search' element={<Search />}></Route>
            <Route exact path='/playlists' element={<Playlist />}></Route>
            <Route exact path='/albums' element={<Albums/>}></Route>
            <Route exact path='/artists' element={<Artists/>}></Route>
          </Routes>
        </div>
      </Router>
        
    );
}

export default App;


{/* <header className="App-header">
    <h1>Spotify React</h1>
    {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
            to Spotify</a>
        : <button onClick={logout}>Logout</button>}

    {token ?
        <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"}>Search</button>
        </form>

        : <h2>Please login</h2>
    }

    {renderArtists()}

</header> */}