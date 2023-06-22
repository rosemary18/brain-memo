package com.brainmemo;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import org.devio.rn.splashscreen.SplashScreen;
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      // Use SplashTheme in AndroidManifest.xml for MainActivity, themes loads before layouts inflate
      setTheme(R.style.AppTheme); // Now set the theme from Splash to App before setContentView
      setContentView(R.layout.launch_screen); // Then inflate the new view
      SplashScreen.show(this); // Now show the splash screen. Hide it later in JS
      super.onCreate(null);
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
  }

  @Override
  protected String getMainComponentName() {
    return "BrainMemo";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  // @Override
  // protected ReactActivityDelegate createReactActivityDelegate() {
  //   return new DefaultReactActivityDelegate(
  //       this,
  //       getMainComponentName(),
  //       // If you opted-in for the New Architecture, we enable the Fabric Renderer.
  //       DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
  //       // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
  //       DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
  //       );
  // }
}
