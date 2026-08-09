import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import conversationReducer from "./conversationSlice";
import messageSlice from "./messageSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    message: messageSlice,
  },
});
