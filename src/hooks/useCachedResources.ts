import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
          'product-sans-infanity': require('../../assets/fonts/ProductSansInfanity.ttf'),
          'AcherusGrotesque-Bold': require('../../assets/fonts/AcherusGrotesque-Bold.ttf'),
          'antipasto-demibold': require('../../assets/fonts/antipasto.demibold.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
