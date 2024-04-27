import React, { PropsWithChildren, ReactNode, useEffect } from 'react';
import { Link, NavigationContainer,getFocusedRouteNameFromRoute ,useRoute,useNavigation} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import CatalogScreen from './screens/CatalogScreen';
import SettingsScreen from './screens/SettingsScreen';
import HomeScreen from './screens/HomeScreen';
import {
  ColorScheme,
  Configuration,
  ShopifyCheckoutSheetProvider,
  useShopifyCheckoutSheet,
} from '@shopify/checkout-sheet-kit';
import { ConfigProvider } from './context/Config';
import { ThemeProvider, useTheme } from './context/Theme';
import { Appearance, StatusBar, StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { CartProvider, useCart } from './context/Cart';
import CartScreen from './screens/CartScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import { ProductVariant, ShopifyProduct } from '../@types';
import ErrorBoundary from './ErrorBoundary';
import { CheckoutException } from '@shopify/checkout-sheet-kit';
import { whiteColor, grayColor, redColor ,blackColor} from '../src/constants/Color'
import { PROFILE_ICON, FOURDOTS_ICON } from '../src/assests/images'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../src/utils';
import SearchScreen from './screens/SearchScreen';
const colorScheme = ColorScheme.web;
const config: Configuration = {
  colorScheme,
  preloading: true,
  colors: {
    ios: {
      backgroundColor: '#f0f0e8',
      tintColor: '#2d2a38',
    },
    android: {
      backgroundColor: '#f0f0e8',
      progressIndicator: '#2d2a38',
      headerBackgroundColor: '#f0f0e8',
      headerTextColor: '#2d2a38',
    },
  },
};

Appearance.setColorScheme('light');

export type RootStackParamList = {
  Catalog: undefined;
  CatalogScreen: undefined;
  ProductDetails: { product: ShopifyProduct; variant?: ProductVariant };
  Cart: { userId: string };
  CartModal: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: `https://2ef994-e1.myshopify.com/api/2023-10/graphql.json`,
  // uri: `https://${env.STOREFRONT_DOMAIN}/api/2023-10/graphql.json`,
  cache,
  headers: {
    'Content-Type': 'application/json',
    // 'X-Shopify-Storefront-Access-Token': env.STOREFRONT_ACCESS_TOKEN ?? '',
    'X-Shopify-Storefront-Access-Token': "579b71826946d784e0a9ebcc5446d974" ?? '',
  },
});

function AppWithTheme({ children }: PropsWithChildren) {
  return <ThemeProvider defaultValue={colorScheme}>{children}</ThemeProvider>;
}

const createNavigationIcon =
  (name: string,IconType:IconType) =>
    ({
      color,
      size,
    }: {
      color: string;
      size: number;
      focused?: boolean;
    }): ReactNode => {
      return <IconType name={name} color={color} size={size} />;
    };

function AppWithContext({ children }: PropsWithChildren) {
  const shopify = useShopifyCheckoutSheet();

  useEffect(() => {
    const close = shopify.addEventListener('close', () => {
      console.log('[CheckoutClose]');
    });

    const pixel = shopify.addEventListener('pixel', event => {
      console.log('[CheckoutPixelEvent]', event.name, event);
    });

    const completed = shopify.addEventListener('completed', event => {
      console.log('[CheckoutCompletedEvent]', event.orderDetails.id);
      console.log('[CheckoutCompletedEvent]', event);
    });

    const error = shopify.addEventListener(
      'error',
      (error: CheckoutException) => {
        console.log('[CheckoutError]', error);
      },
    );

    return () => {
      pixel?.remove();
      completed?.remove();
      close?.remove();
      error?.remove();
    };
  }, [shopify]);

  return (
    <ConfigProvider>
      <ApolloProvider client={client}>
        <CartProvider>
          <StatusBar barStyle="default" />
          {children}
        </CartProvider>
      </ApolloProvider>
    </ConfigProvider>
  );
}

function CatalogStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        headerRight: CartIcon,
      }}>
      <Stack.Screen
        name="CatalogScreen"
        component={CatalogScreen}
        options={{ headerShown: true, headerTitle: 'Catalog' }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ route }) => ({
          headerTitle: route.params.product.title,
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name="CartModal"
        component={CartScreen}
        options={{
          title: 'Cart',
          presentation: 'modal',
          headerRight: undefined,
        }}
      />
    </Stack.Navigator>
  );
}

function CartIcon() {
  const theme = useTheme();

  return (
    <Link to="/CartModal">
      <Entypo name="shopping-basket" size={24} color={theme.colors.secondary} />
    </Link>
  );
}
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={{ top: -5, alignItems: "center", justifyContent: "center" }} onPress={onPress}>
    <View style={styles.roundFooterBtn}>
      {children}
    </View>
  </TouchableOpacity>
);
function AppWithNavigation({ route }: { route: any }) {
  const { totalQuantity } = useCart();

  return (
    <NavigationContainer >
      <Tab.Navigator
        tabBarOptions={{
          style: styles.footerContainer,
          labelStyle: styles.tabLabel,
          tabStyle: styles.tabStyle,
          activeTintColor: blackColor,
          inactiveTintColor: grayColor,
        }}
      >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: createNavigationIcon('home',Entypo),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogStack}
        options={{
          headerShown: false,
          tabBarIcon: createNavigationIcon('shoppingcart',AntDesign),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          // tabBarIcon: () => <Image source={FOURDOTS_ICON} style={styles.icon} resizeMode="contain" />,
          tabBarIcon: createNavigationIcon('search',Ionicons),
          tabBarLabel: () => null,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: createNavigationIcon('heart',Entypo),
          tabBarLabel: () => null,
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={PROFILE_ICON}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode='contain'
            />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ShopifyCheckoutSheetProvider configuration={config}>
        <AppWithTheme>
          <AppWithContext>
            <AppWithNavigation />
        </AppWithContext>
        </AppWithTheme>
      </ShopifyCheckoutSheetProvider>
    </ErrorBoundary>
  );
}

export default App;
const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    backgroundColor: whiteColor,
  },
  tabLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  tabStyle: {
    justifyContent: 'center',
  },
  tabIcon: {
    width: wp(7),
    height: hp(3),
  },
  roundFooterBtn: {
    width: wp(16),
    height: hp(8),
    alignItems: 'center',
    position: 'relative',
    bottom: 11,
    backgroundColor: redColor,
    borderRadius: 50,
    justifyContent: 'center',

  },
  icon: {
    width: wp(7),
    height: hp(3),
    resizeMode: 'contain',
  },
});
