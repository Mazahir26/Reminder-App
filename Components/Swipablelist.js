import React, { useState } from "react";
import SwipeableItem, { UnderlayParams } from "react-native-swipeable-item";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
const { multiply, sub } = Animated;
import Animated from "react-native-reanimated";
import { useTheme } from "react-native-paper";

export default function renderItem({
  item,
  index,
  itemRefs,
  deleteItem,
  showmodel,
}) {
  const { colors } = useTheme();

  const renderUnderlayLeft = ({ item, percentOpen }) => (
    <Animated.View
      style={[
        styles.row,
        styles.underlayLeft,
        { opacity: percentOpen, backgroundColor: colors.elemprim },
      ]} // Fade in on open
    >
      <TouchableOpacity onPressOut={() => deleteItem(item)}>
        <FontAwesome name="trash-o" size={35} color={colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderUnderlayRight = ({ item, percentOpen, open, close }) => (
    <Animated.View
      style={[
        styles.row,
        styles.underlayRight,
        {
          backgroundColor: colors.elemsec,
          transform: [{ translateX: multiply(sub(1, percentOpen), -400) }], // Translate from left on open
        },
      ]}
    >
      <TouchableOpacity onPressOut={close}>
        <Text style={[styles.text, { color: colors.text }]}>CLOSE</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SwipeableItem
      key={item.key}
      item={item}
      ref={(ref) => {
        if (ref && !itemRefs.get(item.key)) {
          itemRefs.set(item.key, ref);
        }
      }}
      onChange={({ open }) => {
        if (open) {
          // Close all other open items
          [...itemRefs.entries()].forEach(([key, ref]) => {
            if (key !== item.key && ref) ref.close();
          });
        }
      }}
      overSwipe={30}
      renderUnderlayLeft={renderUnderlayLeft}
      renderUnderlayRight={renderUnderlayRight}
      snapPointsLeft={[150]}
      snapPointsRight={[175]}
    >
      <View style={[styles.row, { flex: 1, backgroundColor: colors.tab }]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 5 }}>
            <TouchableOpacity onPress={() => showmodel(item)}>
              <Text style={[styles.text, { color: colors.text, flex: 1 }]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sep} />
          <View style={{ flex: 0.3 }}>
            <Text
              style={[
                styles.text,
                {
                  color: colors.text,
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 22,
                },
              ]}
            >
              {`${moment(item.Date).format("hh:mm a")}\n${
                moment(item.Date).format("Do ") +
                "," +
                moment(item.Date).format("MMM")
              }`}
            </Text>
          </View>
        </View>
      </View>
    </SwipeableItem>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  TitleContainer: {
    flex: 0.2,
    justifyContent: "center",
    marginHorizontal: 7,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "gray",
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
  },
  underlayRight: {
    flex: 1,
    justifyContent: "flex-start",
    borderWidth: 0,
  },
  underlayLeft: {
    flex: 1,
    justifyContent: "flex-end",
    borderWidth: 0,
  },
  sep: {
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 10,
    opacity: 0.5,
    alignSelf: "stretch",
    marginVertical: 10,
  },
});
//   <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 5 }}>
//     <TouchableOpacity onPress={() => seteditable(!editable)}>
//       <TextInput
//         maxLength={150}
//         multiline
//         onBlur={() => seteditable(false)}
//         editable={editable}
//         onChangeText={(text) => change_text({ item, text })}
//         value={item.text}
//         style={[styles.text, { flex: 1 }]}
//       />
//     </TouchableOpacity>
//   </View>;
