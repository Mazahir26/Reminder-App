import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import Element from "../Components/Birthday/birthday_swipable";
import Model from "../Components/Birthday/birthdaymodel";
import { Context } from "../Context/BirthdayDataContext";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  TouchableOpacity,
  Platform,
  UIManager,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function My_List() {
  const { state, add_birthday, delete_birthday, edit } = useContext(Context);
  const { colors } = useTheme();
  const [showmodel, setmodel] = useState(false);
  const [selecteditem, setselecteditem] = useState(null);

  useEffect(() => {
    state.sort(function (a, b) {
      var keyA = new Date(a.Date).getTime(),
        keyB = new Date(b.Date).getTime();
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }, [state]);

  useEffect(() => {
    state.map((item) => {
      edit({ selecteditem: item, text: item.text, time: item.Date });
    });
  }, []);

  let itemRefs = new Map();

  const chnage_model = (item) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.linear,
        LayoutAnimation.Properties.opacity
      )
    );
    setselecteditem(item);
    setmodel(!showmodel);
  };
  const hide_model = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.linear,
        LayoutAnimation.Properties.opacity
      )
    );
    setmodel(false);
    setselecteditem(null);
  };

  function emptylist() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            styles.text,
            { fontSize: 25, textAlign: "center", color: colors.text },
          ]}
        >
          {"Click on the plus icon to add Birthday Reminder."}
        </Text>
      </View>
    );
  }

  function footer() {
    return (
      <View
        style={{
          height: 75,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            add_birthday();
          }}
        >
          <AntDesign name="plus" size={34} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  }
  if (showmodel) {
    return (
      <Model edit={edit} hide_model={hide_model} selecteditem={selecteditem} />
    );
  }
  function header() {
    return (
      <View style={styles.TitleContainer}>
        <Text style={[styles.text, { fontSize: 45, color: colors.text }]}>
          Birthdays
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={header}
        ListEmptyComponent={emptylist}
        style={{ flex: 0.8 }}
        keyExtractor={(item) => item.key}
        data={state}
        renderItem={({ item, index }) => (
          <Element
            index={index}
            item={item}
            itemRefs={itemRefs}
            deleteItem={(item) => {
              delete_birthday(item);
            }}
            showmodel={chnage_model}
          />
        )}
        ListFooterComponent={footer}
      />
    </View>
  );
}

export default My_List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  TitleContainer: {
    flex: 0.4,
    justifyContent: "center",
    marginHorizontal: 7,
    marginVertical: 20,
  },
  text: {
    fontWeight: "bold",
    color: "gray",
    fontSize: 24,
  },
});
