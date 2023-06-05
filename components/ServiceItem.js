import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
export default function ServiceItem({ data }) {
  const { params } = useRoute();
  const navigation = useNavigation();

  const navigateToService = useCallback(() => {
    navigation.navigate("SingleService", { data });
  }, [data]);

  if (!data)
    return (
      <View
        style={{
          height: "60%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          color={"red"}
          size={50}
          style={{ alignSelf: "center" }}
        />
      </View>
    );
  return (
    <TouchableOpacity style={styles.container} onPress={navigateToService}>
      <Text style={{ fontSize: 18 }}>{data[0]?.s_title}</Text>
      <Ionicons name="checkmark" size={25} color={"green"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});
