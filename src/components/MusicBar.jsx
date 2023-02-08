import  React from "react";
import prev_icon from './assets/previous.svg';
import next_icon from './assets/next.svg';
import play_icon from './assets/play.svg';
import pause_icon from './assets/pause.svg';

const MusicBar = ({track_length, status=0, track_title, track_artist, cover_art, playing=false, play, pause, next, previous, fetchDevices, seek}) => {
    const displayDevices = () => {
      document.getElementById("device-list-overlay").style.display = "block";
      fetchDevices()
    }
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
          {/* <input onChange={() => (seek())} type="range" id="seek" className="track-seek" max={track_length} min="0" value={status}></input> */}
          <div id="player-progress" className="player-progress">
            <div id="seek" className="player-progress-filled" style={{flexBasis: "0%"}}></div>
          </div>
        </div>
        <span onClick={displayDevices} id="device-btn">
        </span>
      </div>
    )
  }

  export default MusicBar;