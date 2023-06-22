import { WebView } from "react-native-webview";
import { ScrollView } from "react-native";
import * as Linking from "expo-linking";
export default function HandlePayment() {
  const handlePaymentResponse = (event) => {
    // Handle payment response from the WebView
    const data = Linking.parse(event.url);
    // Extract relevant information from 'data' and update your app's state or perform necessary actions
  };
  return (
    <ScrollView>
      <WebView
        source={{ uri: "https://google.com" }}
        onNavigationStateChange={handlePaymentResponse}
        style={{ height: 150, width: 500 }}
      />
    </ScrollView>
  );
}
