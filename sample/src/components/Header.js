import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { whiteColor, redColor } from '../constants/Color'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { LOVE_DRINK_LOGO } from '../assests/images';
import { LETRO } from '../constants/Constants'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
const { alignJustifyCenter, justifyContentCenter, alignItemsCenter, flexDirectionRow, justifyContentSpaceBetween, resizeModeContain } = BaseStyle;
const Header = (props) => {

  return (
    <View style={[styles.header, flexDirectionRow, alignJustifyCenter]}>
      {props?.leftIcon && <TouchableOpacity style={[styles.menuButton, justifyContentCenter]} onPress={props.onBackPress}>
        {props?.iconType ? (
          <props.iconType name={props?.leftIcon} size={30} color={redColor} />
        ) : (
          <Entypo name={props?.leftIcon} size={30} color={redColor} />
        )}
      </TouchableOpacity>}
      <TouchableOpacity style={[styles.logoContainer, alignJustifyCenter]} onPress={props?.onTextPress}>
        {/* <Text style={styles.text}>{LETRO}</Text> */}
        <Image source={LOVE_DRINK_LOGO} style={[resizeModeContain, styles.logoImage]} />
      </TouchableOpacity>
      {(props?.onBucketPress && props.onSerchPress) && <View style={[styles.searchBox, justifyContentSpaceBetween, flexDirectionRow]}>
        <TouchableOpacity onPress={props.onSerchPress}>
          <Ionicons name="search" size={30} color={redColor} />
        </TouchableOpacity>
        <TouchableOpacity style={[alignJustifyCenter]} onPress={props?.onBucketPress}>
          <AntDesign name="shoppingcart" size={30} color={redColor} />
        </TouchableOpacity>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // height: hp(5),
    paddingHorizontal: spacings.xLarge,
    paddingVertical: spacings.small,
    backgroundColor: whiteColor
  },
  menuButton: {
    width: '20%',
  },
  logoContainer: {
    width: '60%',
  },
  searchBox: {
    width: '20%',
  },
  text: {
    fontSize: style.fontSizeLarge1x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
  },
  logoImage: {
    width: wp(50),
    height: hp(5),
  }
});

export default Header;
