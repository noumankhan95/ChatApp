import {
    View,
    StyleSheet,
    Text,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Alert,
    Animated,
    Image,
  } from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  import ChatMessage from "../components/ChatMessage";
  import * as ImagePicker from "expo-image-picker";
  import { useCallback, useState, useEffect, useRef } from "react";
  import { Audio } from "expo-av";
  import * as DocumentPicker from "expo-document-picker";
  import { extname } from "path";
  const messages = [
    {
      id: 1,
      message:
        "came in handy recently when handling the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: false,
    },
    {
      id: 2,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: true,
    },
    {
      id: 3,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: false,
    },
    {
      id: 4,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: true,
    },
    {
      id: 5,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: true,
    },
    {
      id: 6,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: true,
    },
    {
      id: 7,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: false,
    },
    {
      id: 8,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: true,
    },
    {
      id: 9,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: false,
    },
    {
      id: 10,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: false,
    },
    {
      id: 11,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: true,
    },
    {
      id: 12,
      message:
        "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
      isadmin: false,
    },
  ];
  export default function ChatScreen() {
    const [messageText, setmessageText] = useState();
    const [recording, setRecording] = useState();
    const [image, setimage] = useState();
    const [document, setdocument] = useState();
    const [Allrecordings, setAllrecordings] = useState([]);
  
    const fadeAnimation = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      const startAnimation = () => {
        Animated.sequence([
          Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => startAnimation());
      };
  
      startAnimation();
  
      return () => {
        fadeAnimation.stopAnimation();
      };
    }, [fadeAnimation]);
  
    const selectImageHandler = useCallback(async () => {
      try {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        const { granted: librarypermission } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted || !librarypermission)
          return Alert.alert(
            "You Must Provide Permissions For Selection of Image"
          );
        const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "Images",
        });
        if (canceled) return;
        setimage((p) => assets[0].uri);
      } catch (e) {}
    }, [image]);
    const sendImageClickHandler = useCallback(async () => {
      try {
        const extension = extname(image);
  
        const iform = new FormData();
        iform.append("image", {
          uri: image,
          name: `image.${extension.substring(1)}`,
          type: `image/${extension.substring(1)}`,
        });
        // const r = await fetch("http://192.168.10.2:3001/file", {
        //   method: "get",
        // });
        const r = await fetch("http://192.168.10.2:3001/file", {
          method: "post",
          body: iform,
          // headers: { "Content-Type": "multipart/form-data" },
        });
  
        const d = await r.json();
        console.log(d);
      } catch (e) {
        console.log("image upload", e);
        Alert.alert("Error", "An Error Occured");
      } finally {
        setimage(null);
      }
    }, [image]);
    const sendVoiceClickHandler = useCallback(async () => {
      try {
        const { granted, canAskAgain } = await Audio.requestPermissionsAsync();
  
        if (!granted)
          return Alert.alert(
            "You Must Provide Permission To Record Voice Message"
          );
        console.log(recording);
  
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        if (recording) {
          setRecording((p) => undefined);
        }
        const { recording: Recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(Recording);
      } catch (e) {
        console.error("Failed to start recording", e);
        Alert.alert("Error", "An Error Occured");
      } finally {
        setRecording((p) => undefined);
      }
    }, [recording, Audio]);
    const stopRecording = useCallback(async () => {
      console.log("Stopping recording..");
      try {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      } catch (e) {
        console.log("stop recording", e);
        Alert.alert("Error", "An Error Occured");
      }
    }, [recording, Audio]);
    const getDurationFormatted = useCallback((millis) => {
      console.log("millis:", millis);
      const minutes = millis / 1000 / 60;
      const minutesDisplay = Math.floor(minutes);
      const seconds = Math.round(minutes - minutesDisplay) * 60;
      const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
      const final = `${minutesDisplay}:${secondsDisplay}`;
      console.log(final);
      return final;
    }, []);
    const sendRecording = useCallback(async () => {
      console.log("Stopping and sending recording..");
      try {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        let updatedRecordings = [...Allrecordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updatedRecordings.push({
          sound: sound,
          duration: getDurationFormatted(status.durationMillis),
          file: recording.getURI(),
        });
        setAllrecordings(updatedRecordings);
        const vform = new FormData();
        vform.append("voice", {
          uri: recording.getURI(),
          name: "voice.m4a",
          type: "audio/mp4",
        });
        const r = await fetch("http://192.168.10.2:3001/file", {
          method: "POST",
          body: vform,
        });
        const d = await r.json();
        console.log(d);
        // const r = await fetch("http://192.168.10.20:3001/file", {
        //   method: "post",
        //   body: vform,
        // });
        // const body = await r.json();
      } catch (e) {
        console.log("stop and send recording", e);
        Alert.alert("Error", "An Error Occured");
      }
    }, [recording]);
    const selectDocumentPickHandler = useCallback(async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["application/*"], // Set the desired file type(s) here
          copyToCacheDirectory: false, // Set to true if you want to copy the file to the app's cache directory
          multiple: true,
        });
  
        if (result.size > 2048 * 1024)
          return Alert.alert("Please Select A file with size lower than 2MB");
        if (result.type === "success") {
          setdocument((p) => result);
        } else {
          setdocument((p) => undefined);
        }
      } catch (error) {
        console.log("file upload", e);
        Alert.alert("Error", "An Error Occured");
      }
    }, [document]);
    const sendDocumentHandler = useCallback(async () => {
      try {
        const dform = new FormData();
        dform.append("document", {
          uri: document.uri,
          name: document.name,
          type: document.mimeType,
        });
        const r = await fetch("http://192.168.10.2:3001/file", {
          method: "POST",
          body: dform,
        });
        const d = await r.json();
      } catch (e) {
      } finally {
        setdocument((p) => undefined);
      }
    }, [document]);
    const textChangeHandler = useCallback((text) => {
      console.log(text);
      setmessageText((p) => text);
    }, []);
    const cancelImageHandler = useCallback(() => {
      setimage((p) => undefined);
    }, [image]);
    const cancelDocumentHandler = useCallback(() => {
      setdocument((p) => undefined);
    }, [document]);
    const sendMessageHandler = useCallback(() => {}, []);
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={-290}
      >
        <View style={{ flex: 0.95 }}>
          <FlatList
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
        {document && (
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                alignSelf: "flex-end",
                flex: 0.09,
              },
            ]}
          >
            <Ionicons
              name="trash-sharp"
              size={35}
              color={"red"}
              onPress={cancelDocumentHandler}
            />
            <Text>Document Attached.You Can Send it Now</Text>
            <Ionicons
              name="send-sharp"
              size={29}
              color={"rgba(115,105,239,255)"}
              onPress={sendDocumentHandler}
            />
          </View>
        )}
        {image && (
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                alignSelf: "flex-end",
                flex: 0.09,
              },
            ]}
          >
            <Ionicons
              name="trash-sharp"
              size={29}
              color={"red"}
              onPress={cancelImageHandler}
            />
            <Image
              source={{ uri: image }}
              style={{ height: 40, width: 100, borderRadius: 10 }}
            />
            <Ionicons
              name="send-sharp"
              size={29}
              color={"rgba(115,105,239,255)"}
              onPress={sendImageClickHandler}
            />
          </View>
        )}
        {recording && (
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                alignSelf: "flex-end",
                flex: 0.09,
              },
            ]}
          >
            <Animated.View style={{ opacity: fadeAnimation }}>
              <Text style={{ fontSize: 20, fontWeight: "300" }}>
                Recording in progress
              </Text>
            </Animated.View>
            <Ionicons
              name="trash-sharp"
              size={29}
              color={"red"}
              onPress={stopRecording}
            />
            <Ionicons
              name="send-sharp"
              size={29}
              color={
                recording || image || messageText
                  ? "rgba(115,105,239,255)"
                  : "rgba(115,115,250,0.5)"
              }
              onPress={sendRecording}
            />
          </View>
        )}
        {!recording && !image && !document && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textinput}
              multiline={true} // Allow multiple lines
              maxLength={500}
              onChangeText={textChangeHandler}
            />
            <View style={styles.iconsContainer}>
              <Ionicons
                name="send-sharp"
                size={29}
                color={
                  recording || image || messageText
                    ? "rgba(115,105,239,255)"
                    : "rgba(115,115,250,0.5)"
                }
                onPress={!recording && sendMessageHandler}
              />
              <Ionicons
                name={recording ? "mic-off" : "mic-outline"}
                size={34}
                color={recording ? "red" : "rgba(115,105,239,255)"}
                onPress={sendVoiceClickHandler}
              />
              <Ionicons
                name="attach"
                size={34}
                color="rgba(115,105,239,255)"
                onPress={selectDocumentPickHandler}
              />
              <Ionicons
                name="image-outline"
                size={34}
                color="rgba(115,105,239,255)"
                onPress={selectImageHandler}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      // justifyContent: "space-between",
      flex: 1,
      borderRadius: 4,
      paddingBottom: 5,
    },
    inputContainer: {
      // width: "100%",
      flexDirection: "row",
      alignItems: "center",
      flex: 0.12,
      paddingHorizontal: 5,
    },
    textinput: {
      width: "60%",
      backgroundColor: "white",
      borderColor: "gray",
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      fontSize: 18,
  
      textAlignVertical: "top",
    },
    iconsContainer: {
      flexDirection: "row",
      width: "40%",
      justifyContent: "space-evenly",
    },
  });
  