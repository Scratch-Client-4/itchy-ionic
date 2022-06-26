package org.scratchclient4.itchy;

import android.content.res.Configuration;
import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  /*
  The below is depreciated code from Capacitor 2.x

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(Http.class);
    }});
    int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    WebSettings webSettings = this.bridge.getWebView().getSettings();
    if (nightModeFlags == Configuration.UI_MODE_NIGHT_YES) {
      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
        webSettings.setForceDark(WebSettings.FORCE_DARK_ON);
      }
    }
  } */
}
