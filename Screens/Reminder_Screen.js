import React, { useState, useContext, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import Element from "../Components/Swipablelist";
import Model from "../Components/model";
import { Context } from "../Context/ReminderDataContext";

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
import { State } from "react-native-gesture-handler";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function My_List() {
  const { state, add_reminder, delete_reminder, edit } = useContext(Context);

  const { colors } = useTheme();
  const [showmodel, setmodel] = useState(false);
  const [selecteditem, setselecteditem] = useState(null);

  let itemRefs = new Map();

  useEffect(() => {
    state.map((item) => {
      let ti = new Date(item.Date);
      if (ti.getTime() <= Date.now()) {
        delete_reminder(item);
      }
    });
    state.sort(function (a, b) {
      var keyA = new Date(a.Date).getTime(),
        keyB = new Date(b.Date).getTime();
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }, [state]);

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
          {
            "Looks like you have no reminder! \n Click on the plus icon to add one."
          }
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
            add_reminder();
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
          Reminders
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
              delete_reminder(item);
            }}
            showmodel={chnage_model}
          />
        )}
        ListFooterComponent={footer}
        // onDragEnd={({ data }) => this.setState({ data })}
        // activationDistance={10}
      />
    </View>
  );
}

/*

          */

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
