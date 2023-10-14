// Audio end

  // const handleMediaPicked = async (pickerResult, index) => {
  //     if (!pickerResult.cancelled) {
  //         if (pickerResult.duration <= maxVideoLengthMilliseconds) {
  //           // set the video attribute to the picker uri since only want upload when the application is submitted

  //           const fileInfo = await getFileInfo(pickerResult.uri)
  //           if (!fileInfo?.size) {
  //             Alert.alert("file size unknown")
  //             return
  //           }

  //           //https://docs.expo.dev/versions/latest/sdk/imagepicker/#uiimagepickercontrollerqualitytype
  //           // for ios there are two options to compress to lower file size but not on android
  //           const sizeInMB = Math.ceil(filesizeToMB(fileInfo.size))
  //           if (sizeInMB > 50) {
  //             Alert.alert("Video response " + index + " size is " + sizeInMB + "MBs, " + maxSizeVideoAllowed + "MBs max allowed(decrease resolution or quality)")
  //             return
  //           }

  //           additionalQuestionResponses[index].questionResponseVideo = pickerResult.uri;
  //           additionalQuestionResponses[index].size = sizeInMB
  //           additionalQuestionResponses[index].length = pickerResult.duration / 1000
  //           // setVideoLinks({
  //           //   ...videoLinks,
  //           //   index: require(additionalQuestionResponses[index].questionResponseVideo)
  //           // })
  //           // videoLinks[index] = require(additionalQuestionResponses[index].questionResponseVideo)
  //           setDataState(!dataState);
  //         } else {
  //           alert("Video too long, please select a new video");
  //         }
  //     }
  // }

  // async function uploadVideoAsync(uri: string) {
  //     // Why are we using XMLHttpRequest? See:
  //     // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  //     console.log("in upload video async")
  //     const blob = await new Promise((resolve, reject) => {
  //       const xhr = new XMLHttpRequest();
  //       xhr.onload = function () {
  //         resolve(xhr.response);
  //       };
  //       xhr.onerror = function (e) {
  //         console.log(e);
  //         reject(new TypeError("Network request failed"));
  //       };
  //       xhr.responseType = "blob";
  //       xhr.open("GET", uri, true);
  //       xhr.send(null);
  //     });
  //     console.log("promise finished")
  //     const fileRef = ref(getStorage(), uuid.v4());
  //     const result = await uploadBytes(fileRef, blob);

  //     // We're done with the blob, close and release it
  //     blob.close();

  //     return await getDownloadURL(fileRef);
  // }

   {/* {additionalQuestionResponses[index].questionResponseVideo != null && additionalQuestionResponses[index].size != 0 &&
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10}}>
              <Text style={{fontSize: 15, fontWeight: '400', paddingRight: 20}}>Size: {additionalQuestionResponses[index].size} MBs</Text>
              <Text>Length: {new Date(additionalQuestionResponses[index].length * 1000).toISOString().substr(11, 8)}</Text>
            </View>
            // <Video 
            //   source={
            //     videoLinks[index]
            //   }
            // />
            // // <Text style={{fontSize: 18, marginVertical: 10}}>
            // //   Video Selected
            // // </Text>
          } */}

// loop through video questions and check that a video uri was given for each one
    // for (let index = 0; index < additionalQuestionResponses.length; index++) {
    //   if (additionalQuestionResponses[index].questionType == 1) {
    //     audioQuestions = true;
    //     if (additionalQuestionResponses[index].recordLocation == null || additionalQuestionResponses[index].recordLocation.length <= 0) {
    //       const questionNum = index + 1;
    //       // setSubmitApplicationLoading(false);
    //       alert("No audio recorded for Additional Question " + questionNum.toString());
    //       return;
    //     }
    //   }
    // }