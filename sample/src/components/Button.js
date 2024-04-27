import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { whiteColor, lightGreenColor, blackColor } from '../constants/Color'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
const {alignJustifyCenter,borderRadius50,textAlign,borderRadius10,borderWidth1 } = BaseStyle;
const Button = ({ onPress, title,loading }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button,alignJustifyCenter,borderRadius10,borderWidth1]}>
      {loading ?
        <ActivityIndicator size="small" color="white" /> :
        <Text style={[styles.buttonText,textAlign]}>{title}</Text>
        }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // backgroundColor: lightGreenColor,
    width: wp(70),
    height: hp(7),
    borderColor:blackColor

  },
  buttonText: {
    color: blackColor,
    fontWeight: style.fontWeightBold.fontWeight,
    fontSize: style.fontSizeNormal2x.fontSize
  },
});

export default Button;
