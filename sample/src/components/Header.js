import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { whiteColor } from '../constants/Color'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { LETRO } from '../constants/Constants'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
const Header = (props) => {

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={props.onBackPress}>
        {props?.iconType ? (
          <props.iconType name={props?.leftIcon} size={30} color={whiteColor} />
        ) : (
          <Entypo name={props?.leftIcon} size={30} color={whiteColor} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoContainer} onPress={props?.onTextPress}>
        <Text style={styles.text}>{LETRO}</Text>
      </TouchableOpacity>
      <View style={styles.searchBox}>
        <TouchableOpacity  onPress={props.onSerchPress}>
          <Ionicons name="search" size={30} color={whiteColor} />
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={props?.onBucketPress}>
          <AntDesign name="shoppingcart" size={30} color={whiteColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,

  },
  menuButton: {
    width: '20%',
    justifyContent: 'center',
  },
  logoContainer: {
    width: '60%',
    alignItems: 'center',

  },
  searchBox: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp(8),
    height: hp(4),
    resizeMode: 'contain',
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
    color: whiteColor,
  },
});

export default Header;
