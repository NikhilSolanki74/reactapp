import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./Features/UserSlice";
import { UnderlineSlice } from "./Features/UnderlineSlice";
import { PaginationSlice } from "./Features/PaginationSlice";
import { ProductSlice } from "./Features/ProductSlice";
export default configureStore({
 reducer:{
    user:UserSlice.reducer,
    line:UnderlineSlice.reducer,
    pagination:PaginationSlice.reducer,
    product:ProductSlice.reducer
 }
})
