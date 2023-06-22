import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Alert } from "react-native";
import Home from "./Screens/Home";
import LangaugeContextProvider from "./store/languageContext";
import UserContextProvider from "./store/userContext";

import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("You Must Enable Notifications For Updates.");
      return;
    }
    Notifications.getDevicePushTokenAsync;
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
        return AsyncStorage.setItem("DeviceToken", token);
      })
      .then((i) => console.log("Token Done", i))
      .catch((e) => console.log("token Error", e));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  console.log("Token", expoPushToken);
  return (
    <UserContextProvider>
      <LangaugeContextProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <Text style={{ marginTop: 60 }}>{expoPushToken}</Text>
          <Home />
        </SafeAreaView>
      </LangaugeContextProvider>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
