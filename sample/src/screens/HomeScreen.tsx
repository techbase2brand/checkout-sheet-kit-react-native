import React, { useRef, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity, PanResponder, Animated, ScrollView, ActivityIndicator } from 'react-native';
import useShopify from '../hooks/useShopify';
import Product from '../components/Product';
import Carousel from '../components/Carousal'
import Header from '../components/Header'
import SearchModal from '../components/Modal/SearchModal'
import ProductDetailsModal from '../components/Modal/ProductDetailsModal'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { LETRO, NEW_PRODUCT, SEE_ALL, POPULAR, RANKING, FILTER } from '../constants/Constants'
import { darkgrayColor, whiteColor, blackColor, grayColor, redColor } from '../constants/Color'
import { GRID_IMAGE, RANKING_IMAGE,BANNER_IMAGE ,BANNER_IMAGE_TWO, } from '../assests/images'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
const { positionAbsolute, flex, alignJustifyCenter, flexDirectionRow, resizeModeContain, resizeModeCover, justifyContentSpaceBetween } = BaseStyle;
const HomeScreen: React.FC = ({ navigation }) => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isPannedUp, setIsPannedUp] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isProductDetailVisible, setIsProductDetailVisible] = useState(false);
  const [products, setProducts] = useState({});
  const { queries } = useShopify();
  const pan = useRef(new Animated.Value(0)).current;
  const [fetchProducts, { data }] = queries.products;
  const leftDoorAnim = useRef(new Animated.Value(0)).current;
  const rightDoorAnim = useRef(new Animated.Value(0)).current;

  const carouselData = [
    { id: 1, image: BANNER_IMAGE },
    { id: 2, image: BANNER_IMAGE_TWO },
  ];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const translateY = pan.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(34), 0],
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
          <View style={[flexDirectionRow]} >
            <Animated.View style={[styles.door, alignJustifyCenter, positionAbsolute, { transform: [{ rotateY: leftDoorRotation }] }]}>
              <Text style={[styles.text, { color: whiteColor }]}>{LETRO}</Text>
            </Animated.View>
            <Animated.View style={[styles.door, alignJustifyCenter, positionAbsolute, { transform: [{ rotateY: rightDoorRotation }] }]}>
              <Text style={[styles.text, { color: whiteColor }]}>{LETRO}</Text>
            </Animated.View>
          </View >
        ) :
          <View style={[styles.container, flex]}>
            <Header
              // leftIcon={"menu"}
              onTextPress={openDoor}
              // onBucketPress={() => navigation.navigate("Cart")}
              // onSerchPress={() => setIsSearchVisible(true)}
              />
            <View style={[styles.carousalBox, alignJustifyCenter]}>
              <Carousel
                data={carouselData}
                renderItem={item => (
                  <View style={[styles.carousalImageView, alignJustifyCenter]}>
                    <Image source={item.image} style={[{ width: wp(100), height: hp(33) }, resizeModeCover]} />
                  </View>
                )}
              />
            </View>

            <Animated.View
              style={[styles.desContainer, positionAbsolute, { transform: [{ translateY }] }]}
              {...panResponder.panHandlers}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {isPannedUp ?
                  <View style={[styles.desHeadingBox, flexDirectionRow, justifyContentSpaceBetween]}>
                    <TouchableOpacity style={[alignJustifyCenter]}>
                      <Image source={GRID_IMAGE} style={[resizeModeContain]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[flexDirectionRow, alignJustifyCenter]}>
                      <Image source={RANKING_IMAGE} style={[resizeModeContain]} />
                      <Text style={[{ fontSize: 20, color: grayColor }]}>{RANKING}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[flexDirectionRow]}>
                      <AntDesign name="filter" size={25} color={blackColor} />
                      <Text style={[{ fontSize: 20, color: grayColor }]}>{FILTER}</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={[styles.desHeadingBox, flexDirectionRow, justifyContentSpaceBetween]}>
                    <Text style={[styles.text, { color: blackColor }]}>{NEW_PRODUCT}</Text>
                    <Text
                      style={[
                        { fontSize: style.fontSizeLarge.fontSize, color: grayColor },
                      ]}
                      onPress={animateSwipeUp}>
                      {SEE_ALL}
                    </Text>
                  </View>
                }
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
                                setIsProductDetailVisible(true),
                                  setProducts(item.node)
                                // navigation.navigate('ProductDetailsNew', {
                                //   product: item.node,
                                // });
                              }}
                            />
                          )}
                          horizontal
                          keyExtractor={(index) => index.toString()}
                          style={styles.flatList}
                        />
                      </View>

                      <View style={[styles.desHeadingBox, flexDirectionRow, justifyContentSpaceBetween]}>
                        <Text style={[styles.text, { color: blackColor }]}>{POPULAR}</Text>
                      </View>
                    </> :
                    <View style={[alignJustifyCenter, { height: hp(30) }]}>
                      <ActivityIndicator size="large" color={blackColor} />
                    </View>
                }
                <View>
                  <FlatList
                    data={data?.products.edges}
                    renderItem={({ item }) => (
                      <Product
                        product={item.node}
                        onPress={() => {
                          setIsProductDetailVisible(true),
                            setProducts(item.node)
                          // navigation.navigate('ProductDetailsNew', {
                          //   product: item.node,
                          // });
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
                          setIsProductDetailVisible(true),
                            setProducts(item.node)
                          // navigation.navigate('ProductDetailsNew', {
                          //   product: item.node,
                          // });
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
                          setIsProductDetailVisible(true),
                            setProducts(item.node)
                          // navigation.navigate('ProductDetailsNew', {
                          //   product: item.node,
                          // });
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
            {isSearchVisible &&
              <SearchModal
                visible={isSearchVisible}
                onClose={() => setIsSearchVisible(false)} />
            }
            {isProductDetailVisible &&
              <ProductDetailsModal
                visible={isProductDetailVisible}
                onClose={() => setIsProductDetailVisible(false)}
                products={products}
              />
            }
          </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkgrayColor,
  },
  icon: {
    width: wp(8),
    height: hp(4),
  },
  text: {
    fontSize: style.fontSizeLarge1x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
  },
  carousalBox: {
    width: wp(100),
    height: hp(33),
  },
  carousalImageView: {
    width: wp(100),
    height: hp(28),
  },
  flatList: {
    width: wp(95),
    height: hp(26),
  },

  desContainer: {
    backgroundColor: whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: spacings.Large2x,
    paddingHorizontal: spacings.xlarge,
    bottom: 0,
    left: 0,
    right: 0,
    top: hp(5),
  },
  desHeadingBox: {
    paddingHorizontal: spacings.Large2x,
    marginVertical: spacings.normalx,
  },
  door: {
    width: wp(100),
    height: hp(100),
    backgroundColor: redColor,
    marginHorizontal: spacings.small2x,
    borderRadius: 10,
    zIndex: 1,
  },
});

export default HomeScreen;
