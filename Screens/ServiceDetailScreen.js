import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import ChatIcon from "../components/ChatIcon";
import Modal from "../components/Modal";
import { useRoute } from "@react-navigation/native";
import HandlePayment from "../components/HandlePayment";
export default function ServiceScreen() {
  const { params } = useRoute();
  const { data } = params;

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
        paddingBottom: 10,
      }}
      style={{ flexGrow: 1 }}
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
      <TouchableOpacity style={styles.payButton}>
        <Text
          style={{
            color: "black",
            textAlign: "center",
          }}
        >
          Pay With Paypal
        </Text>
      </TouchableOpacity>
      <HandlePayment />

      <ChatIcon data={data[0]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: { color: "rgba(115,105,239,255)" },
  payButton: {
    backgroundColor: "orange",
    padding: 15,
    alignSelf: "center",
    width: "20%",
    height: "10%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
