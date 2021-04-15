import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LayoutAnimation } from "react-native";
import * as Notifications from "expo-notifications";

const Reminder_reducer = (state, action) => {
  switch (action.type) {
    case "add_reminder":
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      let data = [
        ...state,
        {
          text: `Tap to edit`,
          key: `key-${1 + Math.random() * 99}`,
          height: 75,
          Date: action.payload.time,
          notificationId: action.payload.value,
        },
      ];
      storeData(data);
      return data;
    case "init_data":
      if (action.payload === null) {
        return [];
      } else return action.payload;
    case "delete_reminder":
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      data = state.filter((d) => d !== action.payload);
      storeData(data);
      return data;
    case "snooze":
      data = state.filter((d) => {
        if (d.notificationId == action.payload.id) {
          let tep = d;
          tep.Date = action.payload.time;
          tep.notificationId = action.payload.newid;
          return tep;
        } else return d;
      });
      storeData(data);
      return data;
    case "edit":
      data = state.filter((d) => {
        if (d == action.payload.selecteditem) {
          let tep = action.payload.selecteditem;
          tep.Date = action.payload.time;
          tep.text = action.payload.text;
          tep.notificationId = action.payload.id;
          return tep;
        } else return d;
      });
      storeData(data);
      return data;
    default:
      return state;
  }
};

const add_reminder = (dispatch) => {
  return () => {
    let time = new Date(Date.now() + 60 * 60 * 1000);
    let tep = new Date(Date.now());
    time.setSeconds(0, 0);
    let id = notif("Tap to edit", time.getTime() / 1000 - tep.getTime() / 1000);
    id.then((value) => {
      dispatch({ type: "add_reminder", payload: { time, value } });
    }).catch((e) => {
      console.error(e);
    });
  };
};
const delete_reminder = (dispatch) => {
  return (id) => {
    Cancle_Notif(id.notificationId);
    dispatch({ type: "delete_reminder", payload: id });
  };
};
const init_data = (dispatch) => {
  return () => {
    getData()
      .then((value) => {
        dispatch({ type: "init_data", payload: value });
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

const snooze = (dispatch) => {
  return ({ val, text, snoozetime }) => {
    let tep = new Date(Date.now());
    let temp = new Date(Date.now() + 60 * 1000 * snoozetime);
    temp.setSeconds(0, 0);
    Cancle_Notif(val);
    // console.log(snoozetime);
    let id = notif(text, temp.getTime() / 1000 - tep.getTime() / 1000);
    id.then((value) => {
      dispatch({
        type: "snooze",
        payload: { time: temp, id: val, newid: value },
      });
    }).catch((e) => {
      console.error(e);
    });
  };
};

const edit = (dispatch) => {
  return ({ selecteditem, text, time }) => {
    let tep = new Date(Date.now());
    let temp = new Date(time);
    temp.setSeconds(0, 0);
    Cancle_Notif(selecteditem.notificationId);
    let id = notif(text, temp.getTime() / 1000 - tep.getTime() / 1000);
    id.then((value) => {
      dispatch({
        type: "edit",
        payload: { selecteditem, text, time, id: value },
      });
    }).catch((e) => {
      console.error(e);
    });
  };
};

export const { Context, Provider } = createDataContext(
  Reminder_reducer,
  { add_reminder, delete_reminder, edit, init_data, snooze },
  []
);

const notif = async (text, time) => {
  let lol = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: text,
      categoryIdentifier: "reminder",
    },
    trigger: {
      seconds: time,
    },
  });
  let action = [
    {
      identifier: "Done",
      buttonTitle: "Done",
      options: {
        // isAuthenticationRequired?: boolean,
        opensAppToForeground: false,
      },
    },
    {
      identifier: "snooze",
      buttonTitle: "Snooze",
      options: {
        // isAuthenticationRequired?: boolean,
        opensAppToForeground: false,
      },
    },
  ];

  let blob = await Notifications.setNotificationCategoryAsync(
    "reminder",
    action
  );
  return lol;
};

// const Cancle_all_notif = async () => {
//   let lol = await Notifications.cancelAllScheduledNotificationsAsync();
//   console.log("cncled all " + lol);
// };

// const all_notif = async () => {
//   let lol = await Notifications.getAllScheduledNotificationsAsync();
//   console.log("-----ALL NOTIFICATIONS----");
//   console.log(lol);
// };

const Cancle_Notif = async (id) => {
  await Notifications.cancelScheduledNotificationAsync(id)
    .then(() => {})
    .catch((e) => {
      console.error(e);
    });
};

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("Reminder-Data", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("Reminder-Data");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};
