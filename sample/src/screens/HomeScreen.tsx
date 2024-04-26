import React, { useRef, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity, PanResponder, Animated, ScrollView, ActivityIndicator } from 'react-native';
import useShopify from '../hooks/useShopify';
import Product from '../components/Product';
import Carousel from '../components/Carousal'
import Header from '../components/Header'
import SearchModal from '../components/Modal/SearchModal'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { LETRO, NEW_PRODUCT, SEE_ALL, POPULAR, RANKING, FILTER } from '../constants/Constants'
import { darkgrayColor, whiteColor, blackColor, grayColor, redColor } from '../constants/Color'
import { EARBUDS_SOLO_IMAGE, BEATS_SOLO_IMAGE, GRID_IMAGE, RANKING_IMAGE } from '../assests/images'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
const HomeScreen: React.FC = ({ navigation }) => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isPannedUp, setIsPannedUp] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { queries } = useShopify();
  const pan = useRef(new Animated.Value(0)).current;
  const [fetchProducts, { data }] = queries.products;
  const leftDoorAnim = useRef(new Animated.Value(0)).current;
  const rightDoorAnim = useRef(new Animated.Value(0)).current;
  const carouselData = [
    { id: 1, image: BEATS_SOLO_IMAGE },
    { id: 2, image: EARBUDS_SOLO_IMAGE },
  ];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const translateY = pan.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(35), 0],
  });
  const animateSwipeUp = () => {
    setIsPannedUp(true)
    Animated.timing(pan, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy < 0) {
          Animated.timing(pan, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }).start();
        } else {
          setIsPannedUp(false)
          Animated.timing(pan, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

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

  return (
    <View style={{ flex: 1, backgroundColor: darkgrayColor }}>
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
              leftIcon={"menu"}
              onTextPress={openDoor}
              onBucketPress={() => navigation.navigate("Cart")}
              onSerchPress={() => setIsSearch(true)} />
            <View style={styles.carousalBox}>
              <Carousel
                data={carouselData}
                renderItem={item => (
                  <View style={styles.carousalImageView}>
                    <Image source={item.image} style={{ width: wp(100), height: hp(32) }} resizeMode="cover" />
                  </View>
                )}
              />
            </View>
            <Animated.View
              style={[styles.desContainer, { transform: [{ translateY }] }]}
              {...panResponder.panHandlers}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* {isPannedUp ?
                  <View style={styles.desHeadingBox}>
                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                      <Image source={GRID_IMAGE} resizeMode="contain" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <Image source={RANKING_IMAGE} resizeMode="contain" />
                      <Text style={[{ fontSize: 20, color: grayColor }]}>{RANKING}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row" }}>
                      <AntDesign name="filter" size={25} color={blackColor} />
                      <Text style={[{ fontSize: 20, color: grayColor }]}>{FILTER}</Text>
                    </TouchableOpacity>
                  </View>
                  : */}
                  <View style={styles.desHeadingBox}>
                    <Text style={[styles.text, { color: blackColor }]}>{NEW_PRODUCT}</Text>
                    <Text
                      style={[

                        { fontSize: 20, color: grayColor },
                      ]}
                      onPress={animateSwipeUp}>
                      {SEE_ALL}
                    </Text>
                  </View>
                  {/* } */}
                {
                  data ?
                    <>
                      <View >
                        <FlatList
                          data={data?.products.edges}
                          renderItem={({ item }) => (
                            <Product
                              product={item.node}
                              onPress={() => {
                                navigation.navigate('ProductDetailsNew', {
                                  product: item.node,
                                });
                              }}
                            />
                          )}
                          horizontal
                          keyExtractor={(index) => index.toString()}
                          style={styles.flatList}
                        />
                      </View>

                      <View style={styles.desHeadingBox}>
                        <Text style={[styles.text, { color: blackColor }]}>{POPULAR}</Text>
                      </View>
                    </> :
                    <View style={{ alignItems: "center", justifyContent: "center", height: hp(30) }}>
                      <ActivityIndicator size="large" color="black" />
                    </View>
                }
                <View>
                  <FlatList
                    data={data?.products.edges}
                    renderItem={({ item }) => (
                      <Product
                        product={item.node}
                        onPress={() => {
                          navigation.navigate('ProductDetails', {
                            product: item.node,
                          });
                        }}
                      />
                    )}
                    horizontal
                    keyExtractor={(index) => index.toString()}
                    style={styles.flatList}
                  />
                </View>
                <View>
                  <FlatList
                    data={data?.products.edges}
                    renderItem={({ item }) => (
                      <Product
                        product={item.node}
                        onPress={() => {
                          navigation.navigate('ProductDetails', {
                            product: item.node,
                          });
                        }}
                      />
                    )}
                    horizontal
                    keyExtractor={(index) => index.toString()}
                    style={styles.flatList}
                  />
                </View>
                <View>
                  <FlatList
                    data={data?.products.edges}
                    renderItem={({ item }) => (
                      <Product
                        product={item.node}
                        onPress={() => {
                          navigation.navigate('ProductDetails', {
                            product: item.node,
                          });
                        }}
                      />
                    )}
                    horizontal
                    keyExtractor={(index) => index.toString()}
                    style={styles.flatList}
                  />
                </View>
              </ScrollView>
            </Animated.View>
            {isSearch && <SearchModal
              visible={isSearch}
              onClose={() => setIsSearch(false)} />}
          </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkgrayColor,
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
  paginationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: wp(2),
    height: hp(.5),
    borderRadius: 5,
    marginHorizontal: 5,
  },
  flatList: {
    width: wp(95),
    height: hp(26),
  },

  desContainer: {
    backgroundColor: whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: hp(5),
  },
  desHeadingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: hp(9),
    backgroundColor: whiteColor,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerBtn: {
    width: '20%',
    alignItems: 'center',
  },
  roundFooterBtn: {
    width: '20%',
    height: hp(10),
    alignItems: 'center',
    position: 'relative',
    bottom: 20,
    backgroundColor: redColor,
    borderRadius: 50,
    justifyContent: 'center',
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
});

export default HomeScreen;
