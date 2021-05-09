import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Platform,
  Button,
  TouchableOpacity,
  useTVEventHandler,
} from 'react-native';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
// import * from 'react-nav'
import Video from 'react-native-video';
import uuid from 'uuid';
import Channels from './constants/channels';
import AuthData from './auth.json';
import EpgData from './epg.json';
// import {Channel, Programme} from '@livetv-app/epgdata';
import {ProgrammeGuide} from '@livetv-app/tvguide';

// const App = () => {
//   const [items, setItems] = useState([
//     {id:uuid.v4(), itemName: 'rice'},
//     {id:uuid.v4(), itemName: 'soap'},
//     {id:uuid.v4(), itemName: 'oil'},
//     {id:uuid.v4(), itemName: 'potato'}
//   ])
//   return(
//     <View style={styles.container}>
//       <Header />
//       <FlatList
//       data={items}
//       renderItem={({item})=>
//       <ListItem item={item} />
//     }
//       />
//     </View>

//   )
// }
const App = () => {
  // The video we will play on the player.
  // https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
  // http://www.streambox.fr/playlists/test_001/stream.m3u8
  // http://encodercdn1.frontline.ca/yavin/output/CPAC_English_720p/playlist.m3u8
  // console.log(channels);
  const video = require('./Components/Assets/yourFacebookVideo.mp4');
  const token =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjAyODkxMzksIm5iZiI6MTYyMDI4OTEzOSwianRpIjoiY2ZhMTE0NDYtYjk3MC00ZTI1LWE1MzItOGRjN2U3ZjBjNmIzIiwiZXhwIjoxNjIwODkzOTM5LCJpZGVudGl0eSI6IlRlc3QiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2NsYWltcyI6eyJjaGFubmVscyI6WzkxMiwxMDAwLDk1Miw5NTMsOTIwLDkyNSwxMDYxLDg0Nyw4NDUsODQ2LDEwNjgsOTg2LDkxNSwxMDUyLDgzNywxMTkxLDkzOSwxMjMzLDEyMDAsMTE4NSwxMTkyLDEwMTcsOTQwLDk0MSw5MjksMTE4NywxMDE5LDkzOSwxMDkzLDEwOTcsMTA5NSwxMDk2LDExODAsMTE4MSwxMTgyLDExODMsMTE4NCw5ODUsODQ5LDkwMSwxMTY4LDEwNzIsMTE3OSw5NjAsMTA1NiwxMDA2LDExOTUsOTcwLDExOTgsMTAwOSwxMDgzLDkyNywxMjAzLDExNzNdfX0.C4X1vzUhQpolF4w9OnTihCszHqs0WmnrTImutDlUxeU';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  async function getAuth() {
    try {
      const result = await axios.post(
        'http://127.0.0.1:7001/api/create-session',
        {
          terminal_code: 'test',
        },
      );
      console.log('result', result);
    } catch (error) {
      console.log(error);
    }
  }

  const videoPlayer = useRef(null);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChannel, setActivcChannel] = useState({});
  const [randMid, setRandMid] = useState(Math.ceil(Channels.length / 2));
  const [isBuffer, setIsBuffer] = useState(false);
  const [channelsData, setChannelsData] = useState([]);
  const [programData, setProgramData] = useState([]);

  const [lastEventType, setLastEventType] = useState('');
  const epgRef = useRef(null);
  const myTVEventHandler = (evt) => {
    setLastEventType(evt.eventType);
    if (evt.eventType === 'left') {
      onPrevPress();
    }
    if (evt.eventType === 'right') {
      onNextPress();
    }
  };
  useTVEventHandler(myTVEventHandler);
  const DAY = 1000 * 60 * 60 * 24;
  const leftBoundary = new Date(Math.floor(Date.now() / DAY) * DAY - DAY * 7);
  const rightBoundary = new Date(Math.ceil(Date.now() / DAY) * DAY + DAY * 7);

  useEffect(() => {
    if (epgRef.current) {
      console.log(epgRef.current);
    }
    // getAuth();
    setActivcChannel(Channels[randMid]);
    const {
      data: {channels},
    } = AuthData;
    const cc = channels.map((c) => {
      return {
        id: c.channel_id.toString(),
        number: parseInt(c.channel_number),
        name: c.name,
        icon: c.logo_url,
        url: c.stream_url,
      };
    });
    setChannelsData([...cc]);
    const {data: epg} = EpgData;

    const pp = epg.map((p) => {
      return {
        id: p.program_id.toString(),
        name: p.title,
        description: p.description,
        start: new Date(p.start_time),
        end: new Date(p.end_time),
        channel: p.channel_id.toString(),
      };
    });
    setProgramData([...pp]);
  }, []);
  console.log('Chnalees', channelsData[0]);

  const onNextPress = () => {
    if (randMid > Channels.length) {
      setActivcChannel(Channels[0]);
      setRandMid(0);
    }

    setRandMid((prev) => prev + 1);

    console.log('next pressed', randMid);

    setActivcChannel(Channels[randMid]);
  };
  const onPrevPress = () => {
    if (randMid < 0) {
      setActivcChannel(Channels[Channels.length - 1]);
      setRandMid(Channels.length - 1);
    }

    setRandMid((prev) => prev - 1);
    console.log('Prev pressed', randMid);
    // setIsLoading(true);
    setActivcChannel(Channels[randMid]);
  };
  // console.log('data', JSON.parse(AuthData));

  const onSeek = (seek) => {
    videoPlayer?.current.seek(seek);
  };

  const onSeeking = (currentVideoTime) => setCurrentTime(currentVideoTime);

  const onPaused = (newState) => {
    setPaused(!paused);
    setPlayerState(newState);
  };
  const onBuffer = (buffer) => {
    // const {isBuffering} = buffer;
    // console.log('buffefr', isBuffering);
    // setIsBuffer(isBuffering);
  };

  const onReplay = () => {
    videoPlayer?.current.seek(0);
    setCurrentTime(0);
    if (Platform.OS === 'android') {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(true);
    } else {
      setPlayerState(PLAYER_STATES.PLAYING);
      setPaused(false);
    }
  };

  const onProgress = (data) => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => {
    setIsLoading(true);
    // setIsNetwork(true);
    // type: 'm3u8';
    // uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
  };

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPrevPress}>
          <Button style={styles.button} title="Prev" />
        </TouchableOpacity>
        <Text style={styles.footer}>TVEvent: {lastEventType}</Text>
        <TouchableOpacity onPress={onNextPress}>
          <Button style={styles.button} title="Next" />
        </TouchableOpacity>
      </View> */}
      {/* {isBuffer ? (
        <View style={styles.container}>
          <Text>Loading....</Text>
        </View>
      ) : null} */}
      {/* <View>
        <Video
          source={activeChannel}
          onEnd={onEnd}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          posterResizeMode={'cover'}
          onProgress={onProgress}
          paused={paused}
          ref={(ref) => (videoPlayer.current = ref)}
          resizeMode={'cover'}
          currentVideoTime={true}
          style={styles.backgroundVideo}
          isFullScreen={false}
          onBuffer={onBuffer}
          paused={false}
        />
        <MediaControls
          isFullScreen={false}
          duration={duration}
          isLoading={isLoading}
          progress={currentTime}
          onPaused={onPaused}
          onReplay={onReplay}
          onSeek={onSeek}
          onSeeking={onSeeking}
          mainColor={'red'}
          playerState={playerState}
          sliderStyle={{containerStyle: {}, thumbStyle: {}, trackStyle: {}}}
        />
      </View> */}
      <ProgrammeGuide
        channels={channelsData}
        programmes={programData}
        ref={epgRef}
        // channel={channelsData[0]}
        leftBoundary={leftBoundary}
        rightBoundary={rightBoundary}
        internalScrolling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 50,
    width: '100%',
    flexDirection: 'row',
  },
  button: {
    width: 100,
    height: 30,
    textAlign: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'darkslateblue',
    fontSize: 40,
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
  },
  mediaControls: {
    height: '60%',

    alignSelf: 'center',
  },
  /**
     * <Image 
      source={{uri:"https://picsum.photos/200"}} 
      style={styles.img}
      />
      img:{
      width:200,
      height:200,
      borderRadius:200/2
    }
     */
});
export default App;
