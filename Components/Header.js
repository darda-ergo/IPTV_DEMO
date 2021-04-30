import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = (params) => {
  return(
    <View style={styles.container}>
      <Text style={styles.textStyle}>{params.title}</Text>

    </View>

  )
};
Header.defaultProps={
    title:'Title'
}
const styles = StyleSheet.create(
  {
    container:{
      height:70,
      backgroundColor: 'darkslateblue', 
      justifyContent: 'center'
    },
    textStyle:{
      color:'#fff', 
      fontSize: 30,
      textAlign:'center'
    }
  }
)
export default Header;