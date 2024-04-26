import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '.././../utils';
import { blackColor, grayColor } from '../../constants/Color'
import { POPULAR, APPLE_MAC_BOOK_PRO, APPLE_WATCH, AIR_PORD, SPEAKER ,BEATS } from '../../constants/Constants'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
const SearchModal = ({ visible, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // onSearch(searchQuery);
    // setSearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.backIconBox} onPress={onClose}>
            <Ionicons name={"arrow-back"} size={30} color={blackColor} />
          </TouchableOpacity>
          <Text style={styles.text}>Search</Text>
        </View>
        <View style={styles.input}>
          <Ionicons name="search" size={25} color={grayColor} />
          <TextInput
            placeholder="Search Categories , Products"
            placeholderTextColor={blackColor}
            style={{ color: blackColor }}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch();
            }}
          />
        </View>
        <Text style={[styles.text, { padding: 10 }]}>{POPULAR}</Text>
        <Text style={[styles.hintText]}>{APPLE_MAC_BOOK_PRO}</Text>
        <Text style={[styles.hintText]}>{BEATS}</Text>
        <Text style={[styles.hintText]}>{APPLE_WATCH}</Text>
        <Text style={[styles.hintText]}>{SPEAKER}</Text>
        <Text style={[styles.hintText]}>{AIR_PORD}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: wp(90),
    height: hp(7),
    borderWidth: 1,
    borderColor: grayColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: blackColor,
  },
  backIconBox: {
    width: "20%"
  },
  hintText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: grayColor,
    fontSize: 17
  }
});

export default SearchModal;
