package com.tuorui;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import cn.reactnative.modules.update.UpdatePackage;
import cn.reactnative.modules.update.UpdateContext;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.eguma.barcodescanner.BarcodeScannerPackage;
import java.util.Arrays;
import java.util.List;
import com.commonTools.RCTCommonToolsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new UpdatePackage(),
          new RCTCameraPackage(),
          new BarcodeScannerPackage(),
          new RCTCommonToolsPackage()
      );
    }

    @Override
    protected String getJSBundleFile() {
        return UpdateContext.getBundleUrl(MainApplication.this);
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
