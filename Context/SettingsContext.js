import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const settings_reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
    case "init_data":
      return action.payload;
    case "toggle_darkmode":
      const data = {
        ...state,
        Theme: !state.Theme,
      };
      storeData(data);
      return data;
  }
};

const toggle_darkmode = (dispatch) => {
  return () => {
    dispatch({ type: "toggle_darkmode" });
  };
};

const init_data_Settings = (dispatch) => {
  return () => {
    getData()
      .then((value) => {
        if (value == null) {
          value = {
            Theme: false,
          };
        }
        dispatch({ type: "init_data", payload: value });
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("Settings-Data", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("Settings-Data");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const { Context, Provider } = createDataContext(
  settings_reducer,
  { toggle_darkmode, init_data_Settings },
  {
    Theme: false,
  }
);
