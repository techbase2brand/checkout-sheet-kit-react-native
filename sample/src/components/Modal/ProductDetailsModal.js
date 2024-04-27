import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '.././../utils';
import { whiteColor, darkgrayColor, redColor, blackColor, goldColor, lightGrayColor, lightBlueColor, grayColor } from '../../constants/Color'
import { DESCRIPTION, ADD_TO_BASKET } from '../../constants/Constants'
import { ALTEC_IMAGE } from '../../assests/images'
import Button from '../Button'
import Carousel from '../Carousal'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { spacings, style } from '../../constants/Fonts';
import { BaseStyle } from '../../constants/Style';
const { alignJustifyCenter, resizeModeCover, textDecorationUnderline, positionAbsolute, flexDirectionRow, justifyContentSpaceEvenly, alignItemsCenter } = BaseStyle;
const ProductDetailsModal = ({ visible, onClose, products }) => {
  console.log("productDetailModal:::::::::", products)
  const [amount, setAmount] = useState(null);
  const [description, setDescription] = useState(null);
  useEffect(() => {
    if (products && products.variants && products.variants.edges) {
      const prices = products.variants.edges.map(edge => edge.node.price.amount);
      if (prices.length > 0) {
        setAmount(prices[0]);
      }
    }
    if (products && products.images && products.images.edges.length > 0) {
      console.log("Image src:", products.images.edges[0].node.url);
    }
    console.log("Description:", products.description);
    setDescription(products.description)
  }, [products]);
  // const carouselData = [
  //   { id: 1, image: ALTEC_IMAGE },
  //   { id: 2, image: ALTEC_IMAGE },
  //   { id: 3, image: ALTEC_IMAGE },
  // ];
  const carouselData = products.images.edges.map(edge => ({
    id: edge.node.id,
    image: { uri: edge.node.url }
  }));

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.productDetailsBox, positionAbsolute]}>
        <ScrollView>
          <View style={[styles.carousalBox, alignJustifyCenter]}>
            <Carousel
              data={carouselData}
              renderItem={item =>
              (
                <View style={[styles.carousalImageView, alignJustifyCenter]}>
                  <Image source={item?.image} style={[{ width: wp(70), height: hp(33) }, resizeMode = "contain"]} />
                </View>
              )}
            />
          </View>
          <View style={styles.desBox}>
            <Text style={[styles.text, { color: blackColor }]}>{products.title}</Text>
            <View style={[flexDirectionRow, justifyContentSpaceEvenly, { width: wp(70) }]}>
              <Ionicons name="star" size={15} color={goldColor} />
              <Ionicons name="star" size={15} color={goldColor} />
              <Ionicons name="star" size={15} color={goldColor} />
              <Ionicons name="star" size={15} color={lightGrayColor} />
              <Ionicons name="star" size={15} color={lightGrayColor} />
              <Text style={[{ color: blackColor }]}>3.8  |  </Text>
              <Text style={[{ color: lightBlueColor }, textDecorationUnderline]}>137 Reviews</Text>
            </View>
            <Text style={[styles.text, { color: blackColor, paddingTop: 20, fontSize: 23 }]}>${amount}</Text>
            <Text style={[styles.text, { color: blackColor, paddingVertical: 15 }]}>{DESCRIPTION}</Text>
            <Text style={[{ color: blackColor }]}>{description}</Text>
          </View>
        </ScrollView>
        <View style={[styles.footer, flexDirectionRow, alignItemsCenter, justifyContentSpaceEvenly]}>
          <Entypo name="heart" size={23} color={grayColor} />
          <Button
            title={ADD_TO_BASKET}
            onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  productDetailsBox: {
    backgroundColor: whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    bottom: 0,
    left: 0,
    right: 0,
    top: hp(5),
    overflow: "hidden"
  },
  carousalBox: {
    width: wp(100),
    height: hp(33),

  },
  carousalImageView: {
    width: wp(100),
    height: hp(33),

  },
  desBox: {
    padding: 30
  },
  footer: {
    height: hp(8),
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: whiteColor,
  },

});

export default ProductDetailsModal;
