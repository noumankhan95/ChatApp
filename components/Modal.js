import { View, Text, StyleSheet } from "react-native";
const Modal = (props) => {
  return <View style={styles.modalContainer}>{props.children}</View>;
};

const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    marginVertical: 30,
    borderRadius: 17,
    overflow: "hidden",
  },
});
export default Modal;
