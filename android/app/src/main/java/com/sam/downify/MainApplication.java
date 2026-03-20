package com.sam.downify;

import android.app.Application;
// import android.content.Context;
// import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
// import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;

import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import androidx.multidex.MultiDexApplication;
import com.microsoft.codepush.react.CodePush;
import com.rnfs.RNFSPackage;
import com.facebook.react.PackageList;
import com.sam.downify.newpipe.YouTubeExtractorPackage;
import com.sam.downify.newpipe.DownloaderImpl;
import org.schabi.newpipe.extractor.NewPipe;
import com.yausername.youtubedl_android.YoutubeDL;
import com.yausername.ffmpeg.FFmpeg;


public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            // packages.add(new RNFSPackage());
          packages.add(new YouTubeExtractorPackage());
          return packages;
        }
        
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

         @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    try {
      NewPipe.init(DownloaderImpl.getInstance());
    } catch (Exception e) {
      e.printStackTrace();
    }
    // Initialize yt-dlp for unthrottled YouTube downloads
    try {
      YoutubeDL.getInstance().init(this);
      FFmpeg.getInstance().init(this);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

}
