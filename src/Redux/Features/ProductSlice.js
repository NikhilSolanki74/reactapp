import { createSlice } from "@reduxjs/toolkit";

export const ProductSlice = createSlice( {
  name:'product',
  initialState:{
   product:{
    page:1,
    pages:1,
    limit:12,
    offset:0,
    next:true,
    prev:false,
    count:0,
}
  },
  reducers:{
    setProduct:(state,action)=>{
        return {product:{...state.product,...action.payload}}
    }
  }
})

export  const {setProduct} = ProductSlice.actions;
