  
package com.brainmemo;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

public class SplashActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);

      try {
        Intent intent = new Intent(this, MainActivity.class);
        Bundle extras = getIntent().getExtras();

        if (extras != null) {
          intent.putExtras(extras);
        }

        intent.setAction(getIntent().getAction());
        intent.setData(getIntent().getData());

        startActivity(intent);
        finish();
      } catch (Exception e) {
        e.printStackTrace();
        finishAffinity();
      }
  }
}