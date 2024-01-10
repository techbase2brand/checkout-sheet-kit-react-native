/*
MIT License

Copyright 2023 - Present, Shopify Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import {ShopifyCheckoutSheetProvider, useShopifyCheckoutSheet} from './context';
import {
  ColorScheme,
  type CheckoutEvent,
  type CheckoutEventCallback,
  type Configuration,
  type ShopifyCheckoutSheetKit,
} from './index.d';

const RNShopifyCheckoutKit = NativeModules.ShopifyCheckoutSheetKit;

if (!('ShopifyCheckoutSheetKit' in NativeModules)) {
  throw new Error(`
  "@shopify/checkout-sheet-kit" is not correctly linked.

  If you are building for iOS, make sure to run "pod install" first and restart the metro server.`);
}

class ShopifyCheckoutSheet implements ShopifyCheckoutSheetKit {
  private static eventEmitter: NativeEventEmitter = new NativeEventEmitter(
    RNShopifyCheckoutKit,
  );

  constructor(configuration?: Configuration) {
    if (configuration != null) {
      this.setConfig(configuration);
    }
  }

  public readonly version: string = RNShopifyCheckoutKit.version;

  public preload(checkoutUrl: string): void {
    RNShopifyCheckoutKit.preload(checkoutUrl);
  }

  public present(checkoutUrl: string): void {
    RNShopifyCheckoutKit.present(checkoutUrl);
  }

  public async getConfig(): Promise<Configuration> {
    return RNShopifyCheckoutKit.getConfig();
  }

  public setConfig(configuration: Configuration): void {
    RNShopifyCheckoutKit.setConfig(configuration);
  }

  public addEventListener(
    eventName: CheckoutEvent,
    callback: CheckoutEventCallback,
  ): EmitterSubscription | undefined {
    return ShopifyCheckoutSheet.eventEmitter.addListener(eventName, callback);
  }

  public removeEventListeners(event: CheckoutEvent) {
    ShopifyCheckoutSheet.eventEmitter.removeAllListeners(event);
  }
}

// API
export {
  ShopifyCheckoutSheet,
  ShopifyCheckoutSheetProvider,
  useShopifyCheckoutSheet,
  ColorScheme,
};

// Types
export {CheckoutEvent, CheckoutEventCallback, Configuration};