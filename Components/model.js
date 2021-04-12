import React, { useState } from "react";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import { useTheme, Snackbar } from "react-native-paper";

import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function ({ selecteditem, hide_model, edit }) {
  const [text, settext] = useState(selecteditem.text);
  const [time, settime] = useState(new Date(selecteditem.Date));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  if (show) {
    return (
      <DateTimePicker
        minimumDate={new Date(Date.now())}
        value={time}
        mode={mode}
        display="default"
        onChange={(event, date) => {
          if (event.type == "dismissed") {
            setShow(false);
            return;
          }
          let tep = new Date(Date.now());

          if (tep.getTime() / 1000 - date.getTime() / 1000 > 1) {
            setShow(false);
            onToggleSnackBar();
            return;
          }
          settime(date);
          setShow(false);
        }}
        style={{ width: 320, backgroundColor: "gray" }} //add this
      />
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => hide_model()}
        style={{
          alignSelf: "flex-end",
          marginHorizontal: 10,
          marginBottom: 10,
        }}
      >
        <AntDesign name="closecircleo" size={30} color={colors.text} />
      </TouchableOpacity>
      <View style={[styles.model, { backgroundColor: colors.tab }]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              marginTop: 7,
              marginHorizontal: 3,
            }}
          >
            <TextInput
              maxLength={100}
              multiline
              numberOfLines={2}
              selectTextOnFocus={text == "Tap to edit"}
              onChangeText={(text) => settext(text)}
              value={text}
              style={[styles.text, { color: colors.text }]}
            />
            <Text
              style={[
                styles.text,
                { fontSize: 14, marginTop: 15, color: colors.text },
              ]}
            >
              {`${moment(time).format("hh:mm a")}, ${
                moment(time).format("Do ") + moment(time).format("MMM YYYY")
              }`}
            </Text>
          </View>
          <View style={[styles.sep]} />
          <View style={{ flexDirection: "column" }}>
            <Text
              style={[
                styles.text,
                { fontSize: 10, alignSelf: "center", color: colors.text },
              ]}
            >
              Tap to change
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setMode("date");
                setShow(true);
              }}
            >
              <Text style={[styles.text, { fontSize: 16, color: colors.text }]}>
                Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setMode("time");
                setShow(true);
              }}
            >
              <Text style={[styles.text, { fontSize: 16, color: colors.text }]}>
                Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          edit({ text, selecteditem, time: moment(time) });
          hide_model();
        }}
        style={styles.button}
      >
        <Text style={[styles.text, { fontSize: 18, color: colors.text }]}>
          Save
        </Text>
      </TouchableOpacity>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "OK",
          onPress: () => {
            onToggleSnackBar();
          },
        }}
      >
        Invaild Date or Time
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    color: "gray",
    fontSize: 24,
  },
  sep: {
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 10,
    opacity: 0.5,
    alignSelf: "stretch",
    marginVertical: 20,
  },
  model: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "gray",
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
});
