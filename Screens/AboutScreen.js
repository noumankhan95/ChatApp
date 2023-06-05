import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Modal from "../components/Modal";
import SelectLanguage from "../components/SelectLanguage";
const aboutData = [
  {
    id: 1,
    text: "About to Facilitate You and Perform your Daily Tasks digitally in France.Free Chat to communicate with one of our agentsto solve your problem remotely within an hour.eliminate your waiting time for your social assistant,to provide hands on digital assistance.We can offer the following services, \n -Online Appointments ,Making or Updating Cv or Resume ,Filling all of your forms,Translation of your documents (Tazkeera,Asylum Cases)etc,Help To Open Food Delivery Accounts(Uber Eats,Deliveroo,Just Eat etc),Searching and Applying for jobs -Pakistan And Iran Visa Application",
    img: require("../assets/about_logo.png"),
    imgstyle: "img1style",
  },
  {
    id: 2,
    // text: "Hello,Please Select A Language",
    img: require("../assets/splashlogo.png"),
    imgstyle: "img2style",
    modal: true,
  },
];

const AboutScreen = () => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrevious = useCallback(() => {
    if (flatListRef.current) {
      const offset = (currentIndex - 1) * width;
      flatListRef.current.scrollToOffset({ offset, animated: true });
      setCurrentIndex((p) => 0);
    }
  }, [width, currentIndex]);

  const handleNext = useCallback(() => {
    if (flatListRef.current) {
      const offset = (currentIndex + 1) * width;
      flatListRef.current.scrollToOffset({ offset, animated: true });
      setCurrentIndex((p) => 1);
    }
  }, [width, currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        keyExtractor={(item) => item.id}
        style={{ flex: 0.8 }}
        data={aboutData}
        renderItem={({ item }) => (
          <View style={[{}, { width }]}>
            <Image source={item.img} style={styles[item.imgstyle]} />
            {item.text && (
              <View style={[{ paddingHorizontal: 10, marginVertical: 10 }]}>
                <Text style={[{ fontSize: 18, color: "white" }]}>
                  {item.text}
                </Text>
              </View>
            )}
            {item.modal && <SelectLanguage />}
          </View>
        )}
        pagingEnabled
        bounces={false}
        onMomentumScrollEnd={(event) => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const viewSize = event.nativeEvent.layoutMeasurement.width;
          const currentIndex = Math.floor(contentOffset / viewSize);
          setCurrentIndex((p) => currentIndex);
        }}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePrevious} style={styles.button}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <View
          style={{
            width: 70,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 50,
              backgroundColor: currentIndex === 0 ? "black" : "gray",
            }}
          ></View>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 50,
              backgroundColor: currentIndex === 1 ? "black" : "gray",
            }}
          ></View>
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Ionicons name="chevron-forward" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(115,105,239,255)",
    paddingVertical: 20,
  },
  item: {
    // backgroundColor: "red",
  },
  textContainer: {},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 0.2,
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  img1style: { width: "100%", height: 360, resizeMode: "contain" },
  img2style: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 50,
  },
});
export default AboutScreen;
