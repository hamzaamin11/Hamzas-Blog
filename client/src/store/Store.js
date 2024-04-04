import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSliceReducer from "../redux/UserSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import ThemeSliceReducer from "../redux/theme/ThemeSlice";

const rootPersist = combineReducers({
  user: UserSliceReducer,
  theme: ThemeSliceReducer,
  // navigation: NavigationSliceReducer,
  // transcript: AddSmsterSliceReducer,
  // submittedApplications: SubmittedApplicationSliceReducer,
  // openApplications: OpenApplicationSliceReducer,
  // application: applicationSliceReducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedRrducer = persistReducer(persistConfig, rootPersist);
export const store = configureStore({
  reducer: persistedRrducer,
});
export const persistor = persistStore(store);
