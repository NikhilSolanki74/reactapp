import { createSlice } from "@reduxjs/toolkit";

export const ProductDataSlice = createSlice({
   name:'productData',
   initialState:{
    products:[]
   },
   reducers:{
    setProductData:(state,action)=>{
      return {products:[...state.products,...action.payload]}
    }
   }
})

export const {setProductData} = ProductDataSlice.actions;