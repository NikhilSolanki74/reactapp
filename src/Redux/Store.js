import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./Features/UserSlice";
import { UnderlineSlice } from "./Features/UnderlineSlice";
import { PaginationSlice } from "./Features/PaginationSlice";
export default configureStore({
 reducer:{
    user:UserSlice.reducer,
    line:UnderlineSlice.reducer,
    pagination:PaginationSlice.reducer
 }
})
