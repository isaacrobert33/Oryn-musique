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
import prev_icon from './assets/previous.svg';
import next_icon from './assets/next.svg';
import play_icon from './assets/play.svg';
import pause_icon from './assets/pause.svg';

const MusicBar = ({track_length, status, track_title, track_artist, cover_art, playing=false, play, pause, next, previous}) => {
  
  return (
    <div className="music-bar">
      <div id="track-info">
        <img id="track-art" width={"64px"} height={"64px"} src={cover_art} alt={cover_art}/>
        <span id="track-title">
          <b>{track_title}</b><br></br>
          <span>{track_artist}</span>
        </span>
      </div>
      
      <div className="status-bar">
        <img onClick={previous} width={"26px"} height={"26px"} src={prev_icon} alt={"previous"}/>
        {
          playing ? (<img onClick={pause} width={"26px"} height={"26px"} src={pause_icon} alt={"pause"}/>) : (<img onClick={play} width={"26px"} height={"26px"} src={play_icon} alt={"play"}/>)
        }
        <img onClick={next} width={"26px"} height={"26px"} src={next_icon} alt={"next"}/>
        <input type="range" className="track-seek" max={track_length} min="0" value={status}></input>
      </div>
      
    </div>
  )
}

function App() {
    const CLIENT_ID = "f8453497694c4440b8458f0182f51618";
    const REDIRECT_URI = "http://localhost:3000";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPES = "user-read-playback-position,user-library-read,user-read-playback-state,user-modify-playback-state,user-read-currently-playing,user-read-recently-played,user-read-playback-position,streaming,app-remote-control"
    const SIGNIN_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`
    // const TOKEN_URL = `https://accounts.spotify.com/api/token`;
    const [token, setToken] = useState("");
    const [userData, setUserData] = useState(null);
    const [player, setPlayer] = useState(undefined);
    const [deviceId, setDeviceId] = useState(undefined);
    const [playingTrack, setPlayingTrack] = useState({});
  
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

    const updateStatus = async () => {
      const {data} = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let trackInfo = {uri: data.item.uri, cover_art: data.item.album.images[0].url, title: data.item.album.name, artist: data.item.album.artists[0].name, playing: data.is_playing};
      setPlayingTrack(trackInfo);
    }

    const play = async (uri) => {
        await axios.put(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, 
            {uris: [uri]}, 
            {headers: {Authorization: `Bearer ${token}`}}
        );
        setTimeout(updateStatus, 20000)
    }

    const pause = async () => {
        await axios.put(
            `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
            {},
            {headers: {Authorization: `Bearer ${token}`}}
        )
    }

    const next = async () => {
        await axios.post(
            `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
            {},
            {headers: {Authorization: `Bearer ${token}`}}
        )
    }
    
    const previous = async () => {
        await axios.post(
            `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
            {},
            {headers: {Authorization: `Bearer ${token}`}}
        )
    }

    const seek = async (position) => {
        await axios.put(
            `https://api.spotify.com/v1/me/player/seek?device_id=${deviceId}&position_ms=${position}`,
            {},
            {headers: {Authorization: `Bearer ${token}`}}
        )
    }

    function startPlayback(token) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
            name: 'Oryn-Playback',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
            window.localStorage.setItem("device_id", device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });


        player.connect();

    };
    }

    // var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    // const startRefresh = () => {
    //   const {data} = axios.get(TOKEN_URL, {
    //     headers: {
    //       Authorization: `Basic ${Base64.encode()}`
    //     }
    //   })
    //   setTimeout((e) => (
    //     startRefresh()
    //   ), 300000)
    // }

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token");
        window.location.reload();
    }

    var reloaded = false;
    const getUserData = async (token) => {
      let response;
      try {
        response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {Authorization: `Bearer ${token}`}
        })
      } catch (error) {
        logout();
        document.getElementById("signin").click();
        if (!reloaded) {
          window.location.reload();
          reloaded = true;
        }
       
        return;
      }
      
      setUserData(response.data);
    }

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token");
        console.log(token, hash);
        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        
        getUserData(token);
        setToken(token);
        startPlayback(token);
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
                <a id="signin" href={SIGNIN_URL}>
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
                <Link className="tabs" to={`/search`}>
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
            </ul>
          </div>
          <Routes>
            <Route exact path='/' element={<Home player={player} device_id={deviceId} />}></Route>
            <Route exact path='/search' element={<Search player={player} updateStatus={updateStatus} />}></Route>
            <Route exact path='/playlists' element={<Playlist player={player} device_id={deviceId} />}></Route>
            <Route exact path='/albums' element={<Albums player={player} device_id={deviceId} />}></Route>
          </Routes>
          <MusicBar track_title={playingTrack.title} track_artist={playingTrack.artist} cover_art={playingTrack.cover_art} play={play} pause={pause} next={next} previous={previous} />
        </div>
      </Router>
        
    );
}

export default App;
