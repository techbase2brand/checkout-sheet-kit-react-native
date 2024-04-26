import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { whiteColor, lightGreenColor } from '../constants/Color'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
const Button = ({ onPress, title,loading }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {loading ?
        <ActivityIndicator size="small" color="white" /> :
        <Text style={styles.buttonText}>{title}</Text>
        }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: lightGreenColor,
    borderRadius: 50,
    width: wp(70),
    height: hp(7),
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: whiteColor,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
});

export default Button;
