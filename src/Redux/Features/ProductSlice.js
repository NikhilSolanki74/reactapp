import { createSlice } from "@reduxjs/toolkit";

export const ProductSlice = createSlice( {
  name:'product',
  initialState:{
   product:{
    limit:12,
    offset:0,
    count:0,
    more:true,
    ck:true
}
  },
  reducers:{
    setProduct:(state,action)=>{
        return {product:{...state.product,...action.payload}}
    },
    reset:()=>{
      return {product:{limit:12,offset:0,count:0,more:true,ck:true}}
    }
  }
})

export  const {setProduct,reset} = ProductSlice.actions;
