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

package com.shopify.reactnative.checkoutkit;

import android.app.Activity;
import android.content.Context;
import androidx.activity.ComponentActivity;
import androidx.core.content.ContextCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import org.jetbrains.annotations.NotNull;
import android.net.Uri;
import com.shopify.checkoutkit.*;

import java.util.HashMap;
import java.util.Map;

public class ShopifyCheckoutKitModule extends ReactContextBaseJavaModule {
  private static final String MODULE_NAME = "ShopifyCheckoutKit";

  private static Configuration checkoutConfig = new Configuration();

  public ShopifyCheckoutKitModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("version", ShopifyCheckoutKit.version);
    return constants;
  }

  @ReactMethod
  public void present(String checkoutURL) {
    Activity currentActivity = getCurrentActivity();
    if (currentActivity instanceof ComponentActivity) {
      Context appContext = getReactApplicationContext();
      CheckoutEventProcessor checkoutEventProcessor = new CustomCheckoutEventProcessor(appContext);
      currentActivity.runOnUiThread(() -> {
        ShopifyCheckoutKit.present(checkoutURL, (ComponentActivity) currentActivity,
            checkoutEventProcessor);
      });
    }
  }

  @ReactMethod
  public void preload(String checkoutURL) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity instanceof ComponentActivity) {
      ShopifyCheckoutKit.preload(checkoutURL, (ComponentActivity) currentActivity);
    }
  }

  private ColorScheme getColorScheme(String colorScheme) {
    switch (colorScheme) {
      case "web_default":
        return new ColorScheme.Web();
      case "light":
        return new ColorScheme.Light();
      case "dark":
        return new ColorScheme.Dark();
      case "automatic":
      default:
        return new ColorScheme.Automatic();
    }
  }

  private String colorSchemeToString(ColorScheme colorScheme) {
    return colorScheme.getId();
  }

  private boolean isValidColorConfig(ReadableMap config) {
    if (config == null) {
      return false;
    }

    String[] colorKeys = {"backgroundColor", "spinnerColor", "headerTextColor", "headerBackgroundColor"};

    for (String key : colorKeys) {
      if (!config.hasKey(key) || config.getString(key) == null || parseColor(config.getString(key)) == null) {
        return false;
      }
    }

    return true;
  }

  private boolean isValidColorScheme(ColorScheme colorScheme, ReadableMap colorConfig) {
    if (colorConfig == null) {
      return false;
    }

    if (colorScheme instanceof ColorScheme.Automatic) {
      if (!colorConfig.hasKey("light") || !colorConfig.hasKey("dark")) {
        return false;
      }

      boolean validLight = this.isValidColorConfig(colorConfig.getMap("light"));
      boolean validDark = this.isValidColorConfig(colorConfig.getMap("dark"));

      return validLight && validDark;
    }

    return this.isValidColorConfig(colorConfig);
  }

  private Color parseColorFromConfig(ReadableMap config, String colorKey) {
    if (config.hasKey(colorKey)) {
      String colorStr = config.getString(colorKey);
      return parseColor(colorStr);
    }

    return null;
  }

  private Colors createColorsFromConfig(ReadableMap config) {
    if (config == null) {
      return null;
    }

    Color webViewBackground = parseColorFromConfig(config, "backgroundColor");
    Color headerBackground = parseColorFromConfig(config, "headerBackgroundColor");
    Color headerFont = parseColorFromConfig(config, "headerTextColor");
    Color spinnerColor = parseColorFromConfig(config, "spinnerColor");

    if (webViewBackground != null && spinnerColor != null && headerFont != null && headerBackground != null) {
      return new Colors(
        webViewBackground,
        headerBackground,
        headerFont,
        spinnerColor
      );
    }

    return null;
  }

  private ColorScheme getColors(ColorScheme colorScheme, ReadableMap config) {
    if (!this.isValidColorScheme(colorScheme, config)) {
      return null;
    }

    if (colorScheme instanceof ColorScheme.Automatic && this.isValidColorScheme(colorScheme, config)) {
      Colors lightColors = createColorsFromConfig(config.getMap("light"));
      Colors darkColors = createColorsFromConfig(config.getMap("dark"));

      if (lightColors != null && darkColors != null) {
        ColorScheme.Automatic automaticColorScheme = (ColorScheme.Automatic) colorScheme;
        automaticColorScheme.setLightColors(lightColors);
        automaticColorScheme.setDarkColors(darkColors);
        return automaticColorScheme;
      }
    }

    Colors colors = createColorsFromConfig(config);

    if (colors != null) {
      if (colorScheme instanceof ColorScheme.Light) {
        ((ColorScheme.Light) colorScheme).setColors(colors);
      } else if (colorScheme instanceof ColorScheme.Dark) {
        ((ColorScheme.Dark) colorScheme).setColors(colors);
      } else if (colorScheme instanceof ColorScheme.Web) {
        ((ColorScheme.Web) colorScheme).setColors(colors);
      }
      return colorScheme;
    }

    return null;
  }

  @ReactMethod
  public void configure(ReadableMap config) {
    Context context = getReactApplicationContext();

    ShopifyCheckoutKit.configure(configuration -> {
      if (config.hasKey("preloading")) {
        configuration.setPreloading(new Preloading(config.getBoolean("preloading")));
      }

      if (config.hasKey("colorScheme")) {
        ColorScheme colorScheme = getColorScheme(config.getString("colorScheme"));
        ReadableMap colorsConfig = config.hasKey("colors") ? config.getMap("colors") : null;
        ReadableMap androidConfig = null;

        if (colorsConfig != null && colorsConfig.hasKey("android")) {
          androidConfig = colorsConfig.getMap("android");
        }

        if (androidConfig != null && this.isValidColorConfig(androidConfig)) {
          ColorScheme colorSchemeWithOverrides = getColors(colorScheme, androidConfig);
          if (colorSchemeWithOverrides != null) {
            configuration.setColorScheme(colorSchemeWithOverrides);
            checkoutConfig = configuration;
            return;
          }
        }

        configuration.setColorScheme(colorScheme);
      }

      checkoutConfig = configuration;
    });
  }

  @ReactMethod
  public void getConfig(Promise promise) {
    WritableNativeMap resultConfig = new WritableNativeMap();

    resultConfig.putBoolean("preloading", checkoutConfig.getPreloading().getEnabled());
    resultConfig.putString("colorScheme", colorSchemeToString(checkoutConfig.getColorScheme()));

    promise.resolve(resultConfig);
  }

  private Color parseColor(String colorStr) {
    try {
      colorStr = colorStr.replace("#", "");

      long color = Long.parseLong(colorStr, 16);

      if (colorStr.length() == 6) {
        // If alpha is not included, assume full opacity
        color = color | 0xFF000000;
      }

      return new Color.SRGB((int) color);
    } catch (NumberFormatException e) {
      System.out.println("Warning: Invalid color string. Default color will be used.");
      return null;
    }
  }
}
