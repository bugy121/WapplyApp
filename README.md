# SyncNow
SyncNow ReactNative Source Code

* install react-native-cli by running: npm install -g react-native-cli
* run "react-native run-ios"

To Run On Xcode Simulator:
1. npm install
2. cd ios
3. pod repo update (if ure on M1, arch -x86_64 pod repo update)
4. pod install (if ure on M1, arch -86_64 pod install)
5. Start Xcode
6. get google services plist from firebase
7. Right click on project in code and and add google services plist
8. Run in xcode

To Run on physical iphone:
1. npm install
2. cd ios
3. pod repo update (if ure on M1, arch -x86_64 pod repo update)
4. pod install (if ure on M1, arch -86_64 pod install)
5. Start xcode
6. get google services plist from firebase
7. Right click on project in code and and add google services plist
8. Connect your computer to your phone with wire
9. Run by selecting the right target in xcode

Common errors/ways to fix things:
1. cmd + shift + k to clean xcode build folder
2. delete node_modules folder, reinstall everything
3. delete derived data folder from xcode
4. killall -9 node (especially if you cant find modules and are asked to npm install)
5. npm start --reset -cache
6. Delete apps in simulator

Known bugs and fixes:
-bug: Could not get batchedbridge(crashes on load) fix: terminate Metro(terminal) and rerun
-bug: Command PhaseScriptExecution failed with a nonzero: https://stackoverflow.com/questions/62245176/command-phasescriptexecution-failed-with-a-nonzero-exit-code-when-archiving

<!-- To run the code on Expo (you need expo app on your phone first):
1. npm install
2. expo start
3. scan the QR code on the expo web page
4. wait for building

Run in simulator on Mac:
1. npm install
2. expo start
3. Start iOS simulator
4. Press "i" in terminal -->
