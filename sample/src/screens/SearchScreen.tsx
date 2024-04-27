import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from './../utils';
import { blackColor, grayColor } from '../constants/Color'
import { POPULAR, APPLE_MAC_BOOK_PRO, APPLE_WATCH, AIR_PORD, SPEAKER, BEATS } from '../constants/Constants'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // onSearch(searchQuery);
    // setSearchQuery('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
      <View style={styles.modalContainer}>
        <View style={styles.input}>
          <Ionicons name="search" size={25} color={grayColor} />
          <View style={{ flex: 1 }}>
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
        </View>
        <Text style={[styles.text, { padding: 10 }]}>{POPULAR}</Text>
        <Text style={[styles.hintText]}>{APPLE_MAC_BOOK_PRO}</Text>
        <Text style={[styles.hintText]}>{BEATS}</Text>
        <Text style={[styles.hintText]}>{APPLE_WATCH}</Text>
        <Text style={[styles.hintText]}>{SPEAKER}</Text>
        <Text style={[styles.hintText]}>{AIR_PORD}</Text>
      </View>
    </KeyboardAvoidingView>

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

export default SearchScreen;
