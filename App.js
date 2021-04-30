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
  // const [isNetwork, setIsNetwork] = useState(true);
  // let randMid = Math.ceil(Channels.length / 2);
  useEffect(() => {
    setActivcChannel(Channels[randMid]);
  }, [activeChannel]);

  const onNextPress = () => {
    if (randMid > Channels.length) return;
    setRandMid((prev) => prev + 1);
    console.log('next pressed', randMid);
    setActivcChannel(Channels[randMid]);
  };
  const onPrevPress = () => {
    if (randMid < 0) return;
    setRandMid((prev) => prev - 1);
    console.log('next pressed', randMid);
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
      <TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} title="Prev" onPress={onPrevPress} />
          <Button style={styles.button} title="Next" onPress={onNextPress} />
        </View>
      </TouchableOpacity>
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
    paddingTop: 10,
    // justifyContent: 'center',r
    // alignItems: 'center'
  },
  textStyle: {
    color: 'darkslateblue',
    fontSize: 40,
  },
  backgroundVideo: {
    marginTop: 50,
    height: 500,
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
