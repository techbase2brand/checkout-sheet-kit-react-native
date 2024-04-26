import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { blackColor, redColor, grayColor } from '../constants/Color'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
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
    <TouchableOpacity style={styles.productContainer} onPress={props?.onPress}>
      <TouchableOpacity style={styles.favProduct} onPress={toggleFavorite}>
        <AntDesign name={isFavorite ? "heart" : "hearto"} size={20} color={redColor} />
      </TouchableOpacity>
      {imageSource && (
        <Image
          source={{ uri: imageSource }}
          style={styles.productImage}
          resizeMode="contain"
        />
      )}
      <Text style={styles.productName}>{title}</Text>
      {priceAmount && currencyCode && (
        <Text style={styles.productPrice}>
          {currencyCode} {priceAmount}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    width: 180,
    alignItems: 'center',
    padding: 20,
  },
  productImage: {
    width: '80%',
    height: 80,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 15,
    color: grayColor,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: blackColor,
    textAlign: 'center',
  },
  favProduct: {
    width: wp(10),
    height: hp(5),
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "center"
  }
});

export default Product;
