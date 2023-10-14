#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#import <UMCore/UMModuleRegistry.h>
#import <UMReactNativeAdapter/UMNativeModulesProxy.h>
#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>
#import <EXSplashScreen/EXSplashScreenService.h>
#import <UMCore/UMModuleRegistryProvider.h>
#import <Firebase.h>
#import "RNFBMessagingModule.h"
#import <AVFoundation/AVFoundation.h>

#if defined(FB_SONARKIT_ENABLED) && __has_include(<FlipperKit/FlipperClient.h>)
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@interface AppDelegate () <RCTBridgeDelegate>

@property (nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;
@property (nonatomic, strong) NSDictionary *launchOptions;

@end

//@interface YourAppCheckProviderFactory : NSObject <FIRAppCheckProviderFactory>
//@end
//
//@implementation YourAppCheckProviderFactory
//
//- (nullable id<FIRAppCheckProvider>)createProviderWithApp:(nonnull FIRApp *)app {
//  if (@available(iOS 14.0, *)) {
//    return [[FIRAppAttestProvider alloc] initWithApp:app];
//  } else {
//    return [[FIRDeviceCheckProvider alloc] initWithApp:app];
//  }
//}
//
//@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
//  YourAppCheckProviderFactory *providerFactory =
//          [[YourAppCheckProviderFactory alloc] init];
//  [FIRAppCheck setAppCheckProviderFactory:providerFactory];
  
  [FIRApp configure];
  
//  // FCM initialize (request notification permission)
//  if ([UNUserNotificationCenter class] != nil) {
//    // iOS 10 or later
//    // For iOS 10 display notification (sent via APNS)
//    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
//    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
//        UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
//    [[UNUserNotificationCenter currentNotificationCenter]
//        requestAuthorizationWithOptions:authOptions
//        completionHandler:^(BOOL granted, NSError * _Nullable error) {
//          // ...
//        }];
//  } else {
//    // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
//    UIUserNotificationType allNotificationTypes =
//    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
//    UIUserNotificationSettings *settings =
//    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
//    [application registerUserNotificationSettings:settings];
//  }

  [application registerForRemoteNotifications];
  
  // Retrieve FCM Token
  [FIRMessaging messaging].delegate = self;
  
  [[FIRMessaging messaging] tokenWithCompletion:^(NSString *token, NSError *error) {
    if (error != nil) {
      NSLog(@"Error getting FCM registration token: %@", error);
    } else {
      NSLog(@"FCM registration token: %@", token);
//      self.fcmRegTokenMessage.text = token;
    }
  }];
  
  [[FIRMessaging messaging] subscribeToTopic:@"weather"
                                  completion:^(NSError * _Nullable error) {
    NSLog(@"Subscribed to weather topic");
  }];
  
#if defined(FB_SONARKIT_ENABLED) && __has_include(<FlipperKit/FlipperClient.h>)
  InitializeFlipper(application);
#endif
  
  self.moduleRegistryAdapter = [[UMModuleRegistryAdapter alloc] initWithModuleRegistryProvider:[[UMModuleRegistryProvider alloc] init]];
  self.launchOptions = launchOptions;
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  #ifdef DEBUG
    [self initializeReactNativeApp];
  #else
    EXUpdatesAppController *controller = [EXUpdatesAppController sharedInstance];
    controller.delegate = self;
    [controller startAndShowLaunchScreen:self.window];
  #endif

  [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  [[AVAudioSession sharedInstance]
                  setCategory: AVAudioSessionCategoryPlayback
                        error: nil];

  return YES;
}

- (RCTBridge *)initializeReactNativeApp
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:self.launchOptions];
  NSDictionary *appProperties = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:self.launchOptions];
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"main" initialProperties:nil];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                               moduleName:@"main"
                                               initialProperties:appProperties];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  return bridge;
 }

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
{
  NSArray<id<RCTBridgeModule>> *extraModules = [_moduleRegistryAdapter extraModulesForBridge:bridge];
  // If you'd like to export some custom RCTBridgeModules that are not Expo modules, add them here!
  return extraModules;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
 #ifdef DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
 #else
  return [[EXUpdatesAppController sharedInstance] launchAssetUrl];
 #endif
}

- (void)appController:(EXUpdatesAppController *)appController didStartWithSuccess:(BOOL)success {
  appController.bridge = [self initializeReactNativeApp];
  EXSplashScreenService *splashScreenService = (EXSplashScreenService *)[UMModuleRegistryProvider getSingletonModuleForClass:[EXSplashScreenService class]];
  [splashScreenService showSplashScreenFor:self.window.rootViewController];
}

// Linking API
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

@end
