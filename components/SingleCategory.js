import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const randomColors = [
  "brown",
  "burlywood",
  "cadetblue",

  "chocolate",
  "coral",
  "cornflowerblue",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",

  "darkgreen",

  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",

  "dodgerblue",
  "firebrick",

  "forestgreen",
  "fuchsia",
];
const SingleCategory = (props) => {
  //   const [imageSrc, setImageSrc] = useState(null);
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: randomColors[Math.floor(Math.random() * 29)],
          padding: 10,
          justifyContent: "space-between",
        },
      ]}
      onPress={() => {
        navigate("SingleCategory", {
          headerTitle: props.cat_name,
          cat_id: props.cat_id,
        });
      }}
    >
      <Text style={styles.cat_name}>{props.cat_name}</Text>
      <View style={{ alignSelf: "flex-end" }}>
        <Ionicons name="chevron-forward" size={30} color={"white"} />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "45%",
    height: 150,
    margin: 10,
    borderRadius: 10,
    borderColor: "rgba(192,192,192,0.4)",
    borderWidth: 1,
    overflow: "hidden",
  },
  cat_name: {
    fontSize: 20,
    color: "white",
  },
});

export default SingleCategory;
