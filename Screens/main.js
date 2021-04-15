import React, { useContext, useEffect, useState } from "react";
import Reminder_Screen from "./Reminder_Screen";
import Birthday_Screen from "./Birthday_Screen";
import Settings_Screen from "./Settings_Screen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { View } from "react-native";
import {
  DefaultTheme,
  Provider as PaperProvider,
  ActivityIndicator,
} from "react-native-paper";
import { Context as SettingsContext } from "../Context/SettingsContext";
import { Context as ReminderContext } from "../Context/ReminderDataContext";
import { Context as BirthdayContext } from "../Context/BirthdayDataContext";

import * as Notifications from "expo-notifications";
const lighttheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6c757d",
    accent: "#6096ba",
    background: "#eeeeee",
    tab: "#ffffff",
    elemprim: "rgb(220,120,120)",
    elemsec: "lightblue",
    text: "#777777",
  },
};
const darktheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#aaafaf",
    accent: "#6096ba",
    background: "#212529",
    tab: "#343a40",
    elemprim: "#777777",
    elemsec: "#777777",
    text: "#bbbbbb",
  },
};

const Tab = createBottomTabNavigator();

function main() {
  const { init_data, snooze } = useContext(ReminderContext);
  const { init_data_Birthday } = useContext(BirthdayContext);
  const { state, init_data_Settings } = useContext(SettingsContext);
  var currentTheme = state.Theme ? lighttheme : darktheme;
  const { colors } = currentTheme;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        if (response.actionIdentifier === "snooze") {
          if (
            response.notification.request.content.categoryIdentifier ==
            "reminder"
          ) {
            snooze({
              text: response.notification.request.content.body,
              val: response.notification.request.identifier,
              snoozetime: 30,
            });
          }
        }
        await Notifications.dismissNotificationAsync(
          response.notification.request.identifier
        );
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    init_data();
    init_data_Birthday();
    init_data_Settings();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator color="#7f2ee1" animating={true} size={40} />
      </View>
    );
  } else
    return (
      <PaperProvider theme={currentTheme}>
        <NavigationContainer>
          <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: colors.background }}
            tabBarOptions={{
              showLabel: false,
              activeBackgroundColor: colors.tab,
              inactiveBackgroundColor: colors.tab,
              activeTintColor: colors.accent,
              inactiveTintColor: colors.primary,
            }}
          >
            <Tab.Screen
              name="Reminder"
              component={Reminder_Screen}
              options={{
                tabBarIcon: ({ size, color }) => (
                  <AntDesign name="clockcircleo" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Birthday"
              component={Birthday_Screen}
              options={{
                tabBarIcon: ({ size, color }) => (
                  <AntDesign name="gift" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={Settings_Screen}
              options={{
                tabBarIcon: ({ size, color }) => (
                  <AntDesign name="setting" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
}

export default main;
