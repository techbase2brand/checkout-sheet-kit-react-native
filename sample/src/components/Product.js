import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { blackColor, redColor, grayColor } from '../constants/Color'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
const { positionAbsolute, alignItemsCenter, resizeModeContain,textAlign} = BaseStyle;
const Product = (props) => {
  const { title, images, variants } = props.product;
  const imageSource = images.edges.length > 0 ? images.edges[0].node.url : null;
  const price = variants.edges.length > 0 ? variants.edges[0].node.price : null;
  const priceAmount = price ? price.amount : null;
  const currencyCode = price ? price.currencyCode : null;
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  return (
    <TouchableOpacity style={[styles.productContainer,alignItemsCenter]} onPress={props?.onPress}>
      <TouchableOpacity style={[styles.favProduct,alignItemsCenter,positionAbsolute]} onPress={toggleFavorite}>
        {/* <AntDesign name={isFavorite ? "heart" : "hearto"} size={20} color={redColor} /> */}
        <AntDesign name={"hearto"} size={20} color={isFavorite ? redColor: blackColor} />
      </TouchableOpacity>
      {imageSource && (
        <Image
          source={{ uri: imageSource }}
          style={[styles.productImage,resizeModeContain]}
        />
      )}
      <Text style={[styles.productName,textAlign]}>{title}</Text>
      {priceAmount && currencyCode && (
        <Text style={[styles.productPrice,textAlign]}>
          {currencyCode} {priceAmount}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    width: wp(50),
    padding: spacings.Large2x,
  },
  productImage: {
    width: '80%',
    height: hp(10),
  },
  productName: {
    fontSize: style.fontSizeNormal1x.fontSize,
    color: grayColor,
  },
  productPrice: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightBold.fontWeight,
    color: blackColor,
  },
  favProduct: {
    width: wp(10),
    height: hp(5),
    top: 10,
    right: 10
  }
});

export default Product;
