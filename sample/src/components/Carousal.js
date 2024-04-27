import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Animated } from 'react-native';
import { BaseStyle } from '../constants/Style';
const {alignJustifyCenter,flexDirectionRow,positionAbsolute } = BaseStyle;
const { width } = Dimensions.get('window');

const Carousal = ({ data, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      setCurrentIndex(Math.floor(value / width));
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const renderDot = index => {
    const opacity = currentIndex === index ? 1 : 0.5;
    return <View key={index} style={[styles.dot, { opacity }]} />;
  };

  const renderItemComponent = ({ item }) => {
    return (
      <View style={[styles.item,alignJustifyCenter]}>
        {renderItem(item)}
      </View>
    );
  };

  return (
    <View style={{ flex: 1}}>
      <FlatList
        data={data}
        renderItem={renderItemComponent}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
      />
     {/* {data.length > 1 && <View style={[styles.dotContainer,alignJustifyCenter,flexDirectionRow,positionAbsolute]}>
        {data.map((_, index) => renderDot(index))}
      </View>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width,
  },
  dotContainer: {
    bottom: -5,
    left: 0,
    right: 0,

  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginHorizontal: 5,
  },
});

export default Carousal;

