import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';

const EpgDataList = (item) => (
  <ScrollView horizontal style={styles.item}>
    <View style={styles.title}>
      <View style={styles.iconCell}>
        <Text>Channel: {item.channelNumber}</Text>
        <Image style={styles.icon} source={{uri: item.logo}} />
      </View>
    </View>

    <View style={styles.title}>
      <Text>Name:{item.title}</Text>
    </View>
    <View style={styles.title}>
      <View style={styles.iconCell}>
        <Text>Channel: {item.channelNumber}</Text>
        <Image style={styles.icon} source={{uri: item.logo}} />
      </View>
    </View>

    <View style={styles.title}>
      <Text>Name:{item.title}</Text>
    </View>
    <View style={styles.title}>
      <View style={styles.iconCell}>
        <Text>Channel: {item.channelNumber}</Text>
        <Image style={styles.icon} source={{uri: item.logo}} />
      </View>
    </View>

    <View style={styles.title}>
      <Text>Name:{item.title}</Text>
    </View>
    <View style={styles.title}>
      <View style={styles.iconCell}>
        <Text>Channel: {item.channelNumber}</Text>
        <Image style={styles.icon} source={{uri: item.logo}} />
      </View>
    </View>

    <View style={styles.title}>
      <Text>Name:{item.title}</Text>
    </View>
    <View style={styles.title}>
      <View style={styles.iconCell}>
        <Text>Channel: {item.channelNumber}</Text>
        <Image style={styles.icon} source={{uri: item.logo}} />
      </View>
    </View>

    <View style={styles.title}>
      <Text>Name:{item.title}</Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    backgroundColor: '#1faaff',
    padding: 20,
    marginVertical: 2,
    borderRightColor: 'red',
    marginHorizontal: 2,
    width: 200,
    height: 60,
    alignItems: 'center',
  },

  textStyle: {
    color: 'darkslateblue',
    fontSize: 40,
  },

  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  icon: {
    height: 40,
    width: 40,
    marginHorizontal: 8,
  },
});

export default EpgDataList;
