import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import SingleCategory from "../components/SingleCategory";
import SelectLanguage from "../components/SelectLanguage";
import * as Notifications from "expo-notifications";
import { Asset } from "expo-media-library";
const MainCategoriesScreen = () => {
  const [Categories, setCategories] = useState();
  const [isloading, setisloading] = useState(false);
  const [changeLanguageTrue, setchangeLanguageTrue] = useState(false);
  const setLanguageChangeModalTrue = useCallback(() => {
    setchangeLanguageTrue((p) => true);
  }, [changeLanguageTrue]);
  const setLanguageChangeModalFalse = useCallback(() => {
    setchangeLanguageTrue((p) => false);
  }, [changeLanguageTrue]);

  useEffect(() => {
    setisloading((p) => true);
    fetch("https://tarrhoon.com/Api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => {
        if (!r.ok) throw "Error Occured Try Again";
        return r.json();
      })
      .then((d) => {
        setCategories((p) => d.data);
        // sendNotification("Recieved A message");
      })
      .catch((e) => {
        return Alert.alert("Error Occured Try Again");
      })
      .finally(() => {
        setisloading((p) => false);
      });
  }, []);
  if (isloading)
    return (
      <View
        style={[
          {
            flex: 1,
            paddingVertical: 40,

            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          },
        ]}
      >
        <ActivityIndicator
          size={60}
          color="rgba(115,105,239,255)"
          style={{ alignSelf: "center" }}
        />
      </View>
    );
  return (
    <View
      style={[
        {
          flex: 1,
          paddingVertical: 40,

          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 3,
        },
        changeLanguageTrue && {
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1,
        },
      ]}
    >
      <Text>All Categories</Text>
      <FlatList
        data={Categories}
        keyExtractor={(item) => item.cat_id}
        renderItem={({ item }) => <SingleCategory {...item} />}
        numColumns={2}
      />
      {
        <Button
          onPress={setLanguageChangeModalTrue}
          title={"Change Language"}
        />
      }
      {changeLanguageTrue && (
        <View
          style={{
            // alignSelf: "center",
            flex: 2,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 0,

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SelectLanguage
            showNext={false}
            closeModal={setLanguageChangeModalFalse}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default MainCategoriesScreen;
