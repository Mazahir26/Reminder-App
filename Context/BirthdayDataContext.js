import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LayoutAnimation } from "react-native";
import * as Notifications from "expo-notifications";

const Birthday_reducer = (state, action) => {
  switch (action.type) {
    case "add_birthday":
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      let data = [
        ...state,
        {
          text: `Tap to change the name`,
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
    case "delete_birthday":
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      data = state.filter((d) => d !== action.payload);
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

const add_birthday = (dispatch) => {
  return () => {
    let tep = new Date(Date.now());
    let time = new Date(Date.now());
    tep.setHours(0, 0, 0, 0);
    time.setHours(0, 0, 0, 0);
    time.setFullYear(tep.getFullYear() + 1);
    let id = notif(" ", time.getTime() / 1000 - tep.getTime() / 1000);
    id.then((value) => {
      time.setFullYear(tep.getFullYear());
      dispatch({ type: "add_birthday", payload: { time, value } });
    }).catch((e) => {
      console.error(e);
    });
  };
};
const delete_birthday = (dispatch) => {
  return (id) => {
    Cancle_Notif(id.notificationId);
    dispatch({ type: "delete_birthday", payload: id });
  };
};
const init_data_Birthday = (dispatch) => {
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
const edit = (dispatch) => {
  return ({ selecteditem, text, time }) => {
    let tep = new Date(Date.now());
    let temp = new Date(time);
    if (tep.getMonth() > temp.getMonth()) {
      temp.setFullYear(tep.getFullYear() + 1);
    }
    if (tep.getMonth() == temp.getMonth()) {
      if (tep.getDate() >= temp.getDate()) {
        temp.setFullYear(tep.getFullYear() + 1);
      } else {
        temp.setFullYear(tep.getFullYear());
      }
    }
    if (tep.getMonth() < temp.getMonth()) {
      temp.setFullYear(tep.getFullYear());
    }
    tep.setHours(0, 0, 0, 0);
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
  Birthday_reducer,
  { add_birthday, delete_birthday, edit, init_data_Birthday },
  []
);

const notif = async (text, time) => {
  let lol = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Happy Birthday ",
      body: text,
      categoryIdentifier: "birthday",
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
  ];

  let bob = await Notifications.setNotificationCategoryAsync(
    "birthday",
    action
  );
  return lol;
};

const Cancle_Notif = async (id) => {
  await Notifications.cancelScheduledNotificationAsync(id)
    .then(() => {
      // all_notif();
    })
    .catch((e) => {
      console.error(e);
    });
};

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("Birthday-Data", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("Birthday-Data");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};
