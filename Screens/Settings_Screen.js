import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Context } from "../Context/SettingsContext";
import { useTheme } from "react-native-paper";

function Settings() {
  const { state, toggle_darkmode } = useContext(Context);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={[styles.text, { fontSize: 45, color: colors.text }]}>
          Settings
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 15,
          }}
        >
          <Text style={[styles.text, { color: colors.text }]}>Theme</Text>
          <TouchableOpacity onPress={toggle_darkmode}>
            <Feather
              name={state.Theme ? "moon" : "sun"}
              size={40}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.TitleContainer}>
        <Text style={[styles.text, { fontSize: 45, color: colors.text }]}>
          About
        </Text>
      </View>
      <Text
        style={[
          styles.text,
          { color: colors.text, fontSize: 16, marginHorizontal: 20 },
        ]}
      >
        Its a simple open source app created with react-native and expo
      </Text>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  TitleContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  text: {
    fontWeight: "bold",
    color: "gray",
    fontSize: 24,
  },
});
