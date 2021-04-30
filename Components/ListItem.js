import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const ListItem = (params) => {
  return(
    <TouchableOpacity style={styles.listItemStyle}>
      <Text style={styles.textStyle}>{params.item.itemName}</Text>
    <Image source={require('./Assets/close.png')}
      style={styles.buttonStyle}
      />
    </TouchableOpacity>

  )
};
ListItem.defaultProps={
    itemName:'No Item!'
}
const styles = StyleSheet.create(
  {
    listItemStyle:{
      height:70,
      padding:10,
      flexDirection:'row',
      backgroundColor: 'aliceblue', 
      justifyContent: 'space-between',
      borderBottomColor: 'darkslateblue',
      alignItems:'center',
      borderBottomWidth:1
    },
    textStyle:{
      color:'darkslateblue', 
      fontSize: 30    
    },
    buttonStyle:{
        height : 60,
        width : 100,
        alignContent : 'flex-end'
    }
  }
)
export default ListItem;