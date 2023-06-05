import { View, Text, StyleSheet } from "react-native";
import ChatIcon from "../components/ChatIcon";
import Modal from "../components/Modal";
import { useRoute } from "@react-navigation/native";
export default function ServiceScreen() {
  const { params } = useRoute();
  const { data } = params;

  return (
    <View
      style={{ flex: 1, justifyContent: "space-between", paddingBottom: 10 }}
    >
      <View>
        <Modal>
          <View style={{ margin: 4 }}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 20,
                  textDecorationLine: "underline",
                  alignSelf: "center",
                  marginVertical: 5,
                },
              ]}
            >
              {data[0].s_title}
            </Text>
            <Text style={[styles.text, { fontSize: 20 }]}>
              Sales Tax <Text>: {data[0].s_tax}</Text>
            </Text>
            <Text style={[styles.text, { fontSize: 20, marginVertical: 10 }]}>
              Service Fee : {data[0].s_fee}
            </Text>
            <Text
              style={[styles.text, { fontSize: 16, marginVertical: 10 }]}
            >{`Description:  \n ${data[0].s_desc}`}</Text>
          </View>
        </Modal>
      </View>
      <ChatIcon data={data[0]} />
    </View>
  );
}

const styles = StyleSheet.create({ text: { color: "rgba(115,105,239,255)" } });
