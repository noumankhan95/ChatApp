import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import Home from "./Screens/Home";
import LangaugeContextProvider from "./store/languageContext";
import UserContextProvider from "./store/userContext";
export default function App() {
  return (
    <UserContextProvider>
      <LangaugeContextProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
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
