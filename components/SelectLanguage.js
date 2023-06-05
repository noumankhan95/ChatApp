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
    image: require("../assets/urdu.png"),
    value: "pr",
  },
  {
    id: 3,
    language: "Persian",
    image: require("../assets/persian.png"),
    value: "persian",
  },
];
const SelectLanguage = (props) => {
  const [selectedOptions, setselectedOption] = useState();
  const { language, setlanguage } = useContext(langContext);
  const { navigate } = useNavigation();
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
    navigate("MainCategories");
  }, [language]);

  return (
    <Modal>
      <View style={{ overflow: "hidden" }}>
        <View
          style={{
            width: "100%",
            backgroundColor: "rgba(128, 128, 128, 0.4)",
            height: 55,
            justifyContent: "center",
            padding: 5,
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
            }}
          >
            <Text>{l.language}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "40%",
              }}
            >
              <Image source={l.image} />
              <RadioButton
                value={l.value}
                status={selectedOptions === l.value ? "checked" : "unchecked"}
                onPress={setoption.bind(null, l.value)}
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
              padding: 15,
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
