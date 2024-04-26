import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Image } from 'react-native';
import { whiteColor, darkgrayColor, redColor, blackColor, goldColor, lightGrayColor, lightBlueColor, grayColor } from '../constants/Color'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { ALTEC_IMAGE } from '../assests/images'
import { LETRO, DESCRIPTION, ADD_TO_BASKET } from '../constants/Constants'
import Header from '../components/Header'
import Button from '../components/Button'
import Carousel from '../components/Carousal'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';

const ProductDetailsScreenNew = ({ navigation }) => {

  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const leftDoorAnim = useRef(new Animated.Value(0)).current;
  const rightDoorAnim = useRef(new Animated.Value(0)).current;
  const carouselData = [
    { id: 1, image: ALTEC_IMAGE },
    { id: 2, image: ALTEC_IMAGE },
    { id: 3, image: ALTEC_IMAGE },
  ];
  const openDoor = () => {
    setIsDoorOpen(true);
    Animated.parallel([
      Animated.timing(leftDoorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rightDoorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      closeDoor();
    }, 2000);
  };

  const closeDoor = () => {
    Animated.parallel([
      Animated.timing(leftDoorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rightDoorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDoorOpen(false);
    });
  };

  const leftDoorRotation = leftDoorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  const rightDoorRotation = rightDoorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });
  return (<View style={styles.container}>
    {
      isDoorOpen === true ? (
        <View style={styles.doorContainer} >
          <Animated.View style={[styles.door, { transform: [{ rotateY: leftDoorRotation }] }]}>
            <Text style={[styles.text, { color: whiteColor }]}>{LETRO}</Text>
          </Animated.View>
          <Animated.View style={[styles.door, { transform: [{ rotateY: rightDoorRotation }] }]}>
            <Text style={[styles.text, { color: whiteColor }]}>{LETRO}</Text>
          </Animated.View>
        </View >
      ) :
        <View style={styles.container}>
          <Header
            iconType={Ionicons}
            leftIcon={"arrow-back"}
            onTextPress={openDoor}
            onBucketPress={() => navigation.navigate("Cart")}
            onBackPress={()=>navigation.goBack()}/>

          <View style={styles.productDetailsBox}>
            <ScrollView>
              <View style={styles.carousalBox}>
                <Carousel
                  data={carouselData}
                  renderItem={item => (
                    <View style={styles.carousalImageView}>
                      <Image source={item.image} style={{ width: wp(100), height: hp(35) }} resizeMode="cover" />
                    </View>
                  )}
                />
              </View>


              <View style={styles.desBox}>
                <Text style={[styles.text, { color: blackColor }]}>Altec Lansing Epsilonia Bluetooth Speaker</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: wp(70) }}>
                  <Ionicons name="star" size={15} color={goldColor} />
                  <Ionicons name="star" size={15} color={goldColor} />
                  <Ionicons name="star" size={15} color={goldColor} />
                  <Ionicons name="star" size={15} color={lightGrayColor} />
                  <Ionicons name="star" size={15} color={lightGrayColor} />
                  <Text style={[{ color: blackColor }]}>3.8  |  </Text>
                  <Text style={[{ color: lightBlueColor, textDecorationLine: "underline" }]}>137 Reviews</Text>
                </View>
                <Text style={[styles.text, { color: blackColor, paddingTop: 20, fontSize: 23 }]}>$255.55</Text>
                <Text style={[styles.text, { color: blackColor, paddingVertical: 15 }]}>{DESCRIPTION}</Text>
                <Text style={[{ color: blackColor }]}>3.8  |  </Text>
                <Text style={[{ color: blackColor }]}>3.8  |  </Text>
                <Text style={[{ color: blackColor }]}>3.8  |  </Text>
                <Text style={[{ color: blackColor }]}>3.8  |  </Text>
                <Text style={[{ color: blackColor }]}>3.8  |  </Text>

              </View>
            </ScrollView>
            <View style={styles.footer}>
              <Entypo name="heart" size={23} color={grayColor} />
              <Button
                title={ADD_TO_BASKET} />
            </View>
          </View>

        </View>
    }
  </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkgrayColor

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
    fontSize: 20,
    fontWeight: '500',
    color: whiteColor,
  },
  doorContainer: {
    flexDirection: 'row',
  },
  door: {
    width: wp(100),
    height: hp(100),
    backgroundColor: redColor,
    marginHorizontal: 5,
    borderRadius: 10,
    position: 'absolute',
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  productDetailsBox: {
    backgroundColor: whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    // paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: hp(5),
  },
  carousalBox: {
    width: wp(100),
    height: hp(33),
    alignItems: 'center',
    justifyContent: 'center',
  },
  carousalImageView: {
    width: wp(100),
    height: hp(28),
    alignItems: "center",
    justifyContent: "center"
  },
  desBox: {
    padding: 30
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-evenly",
    height: 50,


  }

});

export default ProductDetailsScreenNew;
