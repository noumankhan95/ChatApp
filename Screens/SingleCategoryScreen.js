import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import ServiceItem from "../components/ServiceItem";
import ChatIcon from "../components/ChatIcon";
import { ActivityIndicator } from "react-native-paper";
import { useContext } from "react";
import { langContext } from "../store/languageContext";
import { Ionicons } from "@expo/vector-icons";
const SingleCategoryScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [isloading, setisloading] = useState(false);
  const [categoryData, setcategoryData] = useState([]);
  const ctx = useContext(langContext);
  useLayoutEffect(() => {
    navigation.setOptions({ title: params?.headerTitle || "Category" });
  }, []);
  useEffect(() => {
    setisloading(true);
    const formData = new FormData();
    formData.append("lang", ctx.language || "eng");

    formData.append("cat_id", params.cat_id);
    fetch("https://tarrhoon.com/Api/catWiseServices", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    })
      .then((r) => {
        if (!r.ok) throw "Error Occured";
        return r.json();
      })
      .then((d) => {
        if (d.status) {
          setcategoryData((p) => [...d.data]);
        } else if (!d.status) {
          return setcategoryData((p) => []);
        }
      })
      .catch((e) =>
        Alert.alert(
          "Error",
          "Couldnt Complete Your Request.Please Make Sure You Have An active internet Connection"
        )
      )
      .finally((e) => setisloading(false));
  }, []);

  if (isloading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={60} color="rgba(115,105,239,255)" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {categoryData.length > 0 ? (
          <FlatList
            data={categoryData}
            keyExtractor={(item) => item?.s_id}
            renderItem={({ item, index }) => {
              console.log("index :", index, item);
              return <ServiceItem data={[item]} />;
            }}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Ionicons name="sad-outline" color={"black"} size={60} />
            <Text style={{ marginTop: 20, marginHorizontal: 30, fontSize: 25 }}>
              No Records Found
            </Text>
          </View>
        )}
      </View>
      <ChatIcon data={categoryData[0] || []} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
export default SingleCategoryScreen;
