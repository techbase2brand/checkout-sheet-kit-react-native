// import React from 'react';
// import { View, FlatList, Dimensions, StyleSheet } from 'react-native';

// const { width } = Dimensions.get('window');

// const Carousal = ({ data, renderItem }) => {
//   const renderItemComponent = ({ item }) => {
//     return (
//       <View style={styles.item}>
//         {renderItem(item)}
//       </View>
//     );
//   };

//   return (
//     <FlatList
//       data={data}
//       renderItem={renderItemComponent}
//       horizontal
//       pagingEnabled
//       showsHorizontalScrollIndicator={false}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     width,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Carousal;

import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Animated } from 'react-native';

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
      <View style={styles.item}>
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
      <View style={styles.dotContainer}>
        {data.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
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

