import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./Features/UserSlice";
import { UnderlineSlice } from "./Features/UnderlineSlice";
import { PaginationSlice } from "./Features/PaginationSlice";
import { PaginationSlice2 } from "./Features/PaginationSlice2";
import { ProductSlice } from "./Features/ProductSlice";
import { ProductDataSlice } from "./Features/ProductDataSlice";
import { UserCartSlice } from "./Features/UserCartSlice";
import { MyOrdersSlice } from "./Features/MyOrdersSlice";

export default configureStore({
 reducer:{
    user:UserSlice.reducer,
    line:UnderlineSlice.reducer,
    pagination:PaginationSlice.reducer,
    pagination2:PaginationSlice2.reducer,
    product:ProductSlice.reducer,
    products:ProductDataSlice.reducer,
    cart:UserCartSlice.reducer,
    orders:MyOrdersSlice.reducer,
 }
})
