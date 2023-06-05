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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatMessage from "../components/ChatMessage";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { extname } from "path";
import { useContext } from "react";
import { Userctx } from "../store/userContext";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import * as FileSystem from "expo-file-system";
// const messages = [
//   {
//     id: 1,
//     message:
//       "came in handy recently when handling the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: false,
//   },
//   {
//     id: 2,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: true,
//   },
//   {
//     id: 3,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: false,
//   },
//   {
//     id: 4,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: true,
//   },
//   {
//     id: 5,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: true,
//   },
//   {
//     id: 6,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: true,
//   },
//   {
//     id: 7,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: false,
//   },
//   {
//     id: 8,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: true,
//   },
//   {
//     id: 9,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: false,
//   },
//   {
//     id: 10,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: false,
//   },
//   {
//     id: 11,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: true,
//   },
//   {
//     id: 12,
//     message:
//       "cameng the return from an API call toa database of census information. The fetch took in a criterion as entered by the user, then r",
//     isadmin: false,
//   },
// ];
export default function ChatScreen() {
  const [messageText, setmessageText] = useState();
  const [recording, setRecording] = useState();
  const [image, setimage] = useState();
  const [document, setdocument] = useState();
  // const [questionText, setquestionText] = useState();
  const [Allrecordings, setAllrecordings] = useState([]);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [isloadingChat, setisloadingChat] = useState(true);
  const [chatMessages, setchatMessages] = useState([]);
  const [inquiryId, setinquiryId] = useState();
  const uctx = useContext(Userctx);
  const [isSending, setisSending] = useState(false);
  const { params } = useRoute();
  const [shouldCreateNewIQ, setshouldCreateNewIQ] = useState(false);
  useEffect(() => {
    //checkchatHistory for InquiryID
    setisloadingChat((p) => true);
    const gform = new FormData();
    if (!uctx.userInfo.c_status) return;
    gform.append("c_id", uctx?.userInfo?.c_id);
    fetch("https://tarrhoon.com/Api/chatHistory", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: gform,
    })
      .then((r) => {
        if (!r.ok) throw "An Error Occured";
        return r.json();
      })
      .then((d) => {
        if (d.status) {
          setshouldCreateNewIQ((p) => false);

          const iqId = d.data.filter((i) => i.q_status == 0);
          if (iqId.length == 0) {
            return setshouldCreateNewIQ((p) => true);
          }
          setinquiryId((p) => iqId[0]?.q_id);
        } else {
          setshouldCreateNewIQ((p) => true);
        }
      })
      .catch((e) => {
        return Alert.alert("Error", "Couldnt Load Your Text Messages");
      })
      .finally((f) => {
        setisloadingChat((p) => false);
      });
  }, []);

  useEffect(() => {
    setisloadingChat((p) => true);
    if (!shouldCreateNewIQ) return;
    const gform = new FormData();
    // console.log("user:", uctx.userInfo?.c_id);
    if (!uctx.userInfo.c_status) return;
    gform.append("c_id", uctx?.userInfo?.c_id);
    gform.append("s_id", params.s_id);
    gform.append("q_subject", `Service ${params.s_title}`);
    gform.append(
      "q_desc",
      `Applying For Service Titled:${params.s_title},ServiceId:${params.s_id},for Category ID ${params.c_id} titled: ${params.c_title}`
    );
    fetch("https://tarrhoon.com/Api/generateQuery", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: gform,
    })
      .then((r) => r.json())
      .then((d) => {
        console.log(d);
        setinquiryId((p) => d.q_id);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((f) => {
        setisloadingChat((p) => false);
      });
  }, [uctx, shouldCreateNewIQ]);
  useEffect(() => {
    setisloadingChat((p) => true);

    const gform = new FormData();
    console.log("user:", uctx.userInfo);
    if (!uctx.userInfo.c_id || !inquiryId) return;

    gform.append("q_id", inquiryId);

    fetch("https://tarrhoon.com/Api/chatDetails", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: gform,
    })
      .then((r) => {
        if (!r.ok) throw "Error";
        return r.json();
      })
      .then((d) => {
        setchatMessages((p) => d?.data);
      })
      .catch((e) => {
        return Alert.alert("Error", "Couldnt Load Your Text Messages");
      })
      .finally((f) => {
        setisloadingChat((p) => false);
      });
  }, [inquiryId]);
  useEffect(() => {
    const u = setInterval(() => {
      const iform = new FormData();
      iform.append("q_id", inquiryId);
      fetch("https://tarrhoon.com/Api/newMessageCheck", {
        method: "Post",
        body: iform,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((r) => {
          if (!r.ok) {
            throw "Error Occured";
          }
          return r.json();
        })
        .then((d) => {
          console.log("status", d);
          if (d.status) {
            chatMessages.unshift({ ...d.message });
          }
        })
        .catch((e) => {
          console.log(e);
          return Alert.alert("An Error Occured Loading Your Messages");
        });
    }, 5000);
    return () => clearInterval(u);
  }, [inquiryId]); //for RealTime Updates
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
  const sendVoiceClickHandler = useCallback(async () => {
    try {
      const { granted, canAskAgain } = await Audio.requestPermissionsAsync();

      if (!granted)
        return Alert.alert(
          "You Must Provide Permission To Record Voice Message"
        );

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (e) {
      console.error("Failed to start recording", e);
      Alert.alert("Error", "An Error Occured");
    } finally {
    }
  }, [recording, Audio]);
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
  const sendFileHandler = useCallback(
    async (type) => {
      try {
        setisSending((p) => true);
        const iform = new FormData();

        // iform.append("q_id", inquiryId);
        iform.append("q_id", inquiryId);
        iform.append("c_id", uctx.userInfo?.c_id);
        if (messageText) iform.append("question", messageText);
        if (type === "image") {
          const extension = extname(image);
          iform.append("q_file", {
            uri: image,
            name: `image.${extension.substring(1)}`,
            type: `image/${extension.substring(1)}`,
          });
        } else if (type === "document") {
          iform.append("q_file", {
            uri: document.uri,
            name: document.name,
            type: document.mimeType,
          });
        } else if (type === "recording") {
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
          iform.append("q_file", {
            uri: recording.getURI(),
            name: "voice.m4a",
            type: "audio/mp4",
          });
        }

        const r = await fetch("https://tarrhoon.com/Api/chatReply", {
          method: "post",
          body: iform,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!r.ok) throw "Error File Upload or Text";

        const d = await r.json();
        console.log(d);
        if (!d.status) throw "Error File Upload or Text";
      } catch (e) {
        console.log("file upload", e);
        Alert.alert("Error", "Couldnt Send your Query .Please Try Again");
      } finally {
        setimage(null);
        setdocument(null);
        setmessageText((p) => "");
        setisSending((p) => false);
      }
    },
    [image, document, recording, messageText, inquiryId, uctx]
  );
  const stopRecording = useCallback(async () => {
    // console.log("Stopping recording..");
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
  }, [recording]);
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "height" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -290}
    >
      <View style={{ flex: 0.95 }}>
        {isloadingChat ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
          >
            <ActivityIndicator size={50} color="rgba(115,105,239,255)" />
          </View>
        ) : (
          <FlatList
            data={chatMessages}
            renderItem={({ item }) => <ChatMessage {...item} />}
            keyExtractor={(item) => item.id}
          />
        )}
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
              paddingHorizontal: 8,
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
          {!isSending ? (
            <Ionicons
              name="send-sharp"
              size={29}
              color={"rgba(115,105,239,255)"}
              onPress={sendFileHandler.bind(null, "document")}
            />
          ) : (
            <ActivityIndicator size={28} color={"rgba(115,105,239,255)"} />
          )}
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
              paddingHorizontal: 8,
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
          {!isSending ? (
            <Ionicons
              name="send-sharp"
              size={29}
              color={"rgba(115,105,239,255)"}
              onPress={sendFileHandler.bind(null, "image")}
            />
          ) : (
            <ActivityIndicator size={28} color={"rgba(115,105,239,255)"} />
          )}
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
              paddingHorizontal: 8,
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
          {!isSending ? (
            <Ionicons
              name="send-sharp"
              size={29}
              color={
                recording || image || messageText
                  ? "rgba(115,105,239,255)"
                  : "rgba(115,115,250,0.5)"
              }
              onPress={sendFileHandler.bind(null, "recording")}
            />
          ) : (
            <ActivityIndicator size={28} color={"rgba(115,105,239,255)"} />
          )}
        </View>
      )}
      {!recording && !image && !document && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textinput}
            multiline={true} // Allow multiple lines
            maxLength={500}
            onChangeText={textChangeHandler}
            value={messageText}
          />
          <View style={styles.iconsContainer}>
            {!isSending ? (
              <Ionicons
                name="send-sharp"
                size={29}
                color={
                  recording || image || messageText
                    ? "rgba(115,105,239,255)"
                    : "rgba(115,115,250,0.5)"
                }
                onPress={sendFileHandler.bind(null, "text")}
              />
            ) : (
              <ActivityIndicator size={28} color={"rgba(115,105,239,255)"} />
            )}
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
