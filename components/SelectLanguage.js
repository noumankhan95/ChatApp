import { useState, useCallback } from "react";
import { View, TouchableOpacity, Text, Image, Alert } from "react-native";
import Modal from "./Modal";
import { useContext } from "react";
import { Button, RadioButton } from "react-native-paper";
import { langContext } from "../store/languageContext";
import { useNavigation } from "@react-navigation/native";
const languages = [
  {
    id: 1,
    language: "English",
    image: require("../assets/eng.png"),
    value: "eng",
  },
  {
    id: 2,
    language: "Pashto",
    image: require("../assets/ur.png"),
    value: "ur",
  },
  {
    id: 3,
    language: "Persian",
    image: require("../assets/persian.png"),
    value: "pr",
  },
];
const SelectLanguage = (props) => {
  const [selectedOptions, setselectedOption] = useState();
  const { language, setlanguage } = useContext(langContext);
  const { navigate, replace } = useNavigation();
  const setoption = useCallback(
    (val) => {
      setselectedOption((p) => val);
      setlanguage(val);
    },
    [selectedOptions]
  );
  const movetoCategories = useCallback(() => {
    console.log(language);
    if (!language) {
      return Alert.alert(
        "Select A Language",
        "Please Select A Language To Continue"
      );
    }
    replace("MainCategories");
  }, [language]);

  return (
    <Modal>
      <View style={{ overflow: "hidden" }}>
        <View
          style={{
            width: "100%",
            backgroundColor: "rgba(128, 128, 128, 0.4)",

            justifyContent: "center",
            padding: 20,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 25 }}>Please Select A Language</Text>
        </View>

        {languages.map((l) => (
          <TouchableOpacity
            key={l.id}
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginVertical: 15,
              paddingHorizontal: 5,
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text>{l.language}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "40%",
                overflow: "hidden",
              }}
            >
              <Image source={l.image} />
              <RadioButton.Item
                value={l.value}
                status={selectedOptions === l.value ? "checked" : "unchecked"}
                onPress={setoption.bind(null, l.value)}
                color="orange"
                uncheckedColor="gray"
                theme={{ mode: "adaptive" }}
                style={{
                  borderWidth: 0.2,
                  borderColor: "gray",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
        {props.showNext && (
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              marginVertical: 10,
              backgroundColor: "rgba(115,105,239,255)",
              marginHorizontal: 10,
              padding: 10,
              borderRadius: 15,
            }}
            onPress={movetoCategories}
          >
            <Text style={{ color: "white" }}>Next</Text>
          </TouchableOpacity>
        )}
        {!props.showNext && (
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              marginVertical: 10,
              backgroundColor: "rgba(115,105,239,255)",
              marginHorizontal: 10,
              padding: 15,
              borderRadius: 15,
            }}
            onPress={props.closeModal}
          >
            <Text style={{ color: "white" }}>Ok</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default SelectLanguage;
