import {
  View,
  StyleSheet,
  SafeAreaView,
  BackHandler,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AboutScreen from "./AboutScreen";
import MainCategoriesScreen from "./MainCategoriesScreen";
import SingleCategoryScreen from "./SingleCategoryScreen";
import ServiceScreen from "./ServiceDetailScreen";
import ChatScreen from "./ChatScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useLayoutEffect, useContext } from "react";
import Authentication from "./Authentication";
import NetInfo from "@react-native-community/netinfo";
import { Userctx } from "../store/userContext";

const Home = (props) => {
  const Stack = createNativeStackNavigator();
  const [showAboutScreen, setShowAboutScreen] = useState(true);
  const [isConnected, setisConnected] = useState();
  const uctx = useContext(Userctx);
  useEffect(() => {
    const checkInternetConnection = async () => {
      const netInfoState = await NetInfo.fetch();
      setisConnected(netInfoState.isConnected);
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setisConnected(state.isConnected);
    });

    checkInternetConnection();

    // Clean up the event listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
  // useLayoutEffect(() => {
  //   AsyncStorage.removeItem("aboutScreenShown", () => {
  //     console.log("removed");
  //     setShowAboutScreen(true);
  //   });
  //   AsyncStorage.removeItem("user", () => {
  //     console.log("removed user");
  //   });
  //   AsyncStorage.removeItem("DeviceToken", () => {
  //     console.log("removed token");
  //   });
  // }, []);
  useLayoutEffect(() => {
    AsyncStorage.getItem("user")
      .then((value) => {
        if (value === null) {
        } else {
          const data = JSON.parse(value);
          uctx.setuserInfo(data);
        }
      })
      .catch((error) => {
        console.log("Error retrieving local storage value:", error);
      });
  }, []);
  useLayoutEffect(() => {
    // Check local storage value to determine if the "About" screen has been shown before

    AsyncStorage.getItem("aboutScreenShown")
      .then((value) => {
        console.log(value);
        if (value === null) {
          // If the value is null, it means the "About" screen has not been shown before
          setShowAboutScreen(true);
          // Update local storage value to indicate that the "About" screen has been shown
          AsyncStorage.setItem("aboutScreenShown", "true");
        } else {
          console.log("Available");
          setShowAboutScreen(false);
        }
      })
      .catch((error) => {
        console.log("Error retrieving local storage value:", error);
      });
  }, []);
  if (!isConnected)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Not Connected To Internet</Text>
        <ActivityIndicator
          size={60}
          color="red"
          style={{ marginVertical: 30 }}
        />
      </View>
    );
  return (
    <SafeAreaView style={styles.maincontainer}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showAboutScreen ? "About" : "MainCategories"}
        >
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainCategories"
            component={MainCategoriesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SingleCategory"
            component={SingleCategoryScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="SingleService"
            component={ServiceScreen}
            options={{ headerShown: true, headerTitle: "Service Details" }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Authentication"
            component={Authentication}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  maincontainer: { flex: 1 },
});
export default Home;
