import React, {useState, useRef, useEffect} from 'react';
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
import Header from './Components/Header';
import ListItem from './Components/ListItem';
import Video from 'react-native-video';
import uuid from 'uuid';
import Channels from './constants/channels';
import channels from './constants/channels';

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

  const videoPlayer = useRef(null);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChannel, setActivcChannel] = useState({});
  const [randMid, setRandMid] = useState(Math.ceil(Channels.length / 2));
  const [isBuffer, setIsBuffer] = useState(false);

  const [lastEventType, setLastEventType] = React.useState('');
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

  useEffect(() => {
    setActivcChannel(Channels[randMid]);
    console.log('re render');
  }, [activeChannel]);

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

  const onSeek = (seek) => {
    videoPlayer?.current.seek(seek);
  };

  const onSeeking = (currentVideoTime) => setCurrentTime(currentVideoTime);

  const onPaused = (newState) => {
    setPaused(!paused);
    setPlayerState(newState);
  };
  const onBuffer = (buffer) => {
    const {isBuffering} = buffer;
    console.log('buffefr', isBuffering);
    setIsBuffer(isBuffering);
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
    <View>
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
      <View>
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
      </View>
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
