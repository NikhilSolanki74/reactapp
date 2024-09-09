import { createSlice } from "@reduxjs/toolkit";

export const ProductDataSlice = createSlice({
   name:'productData',
   initialState:{
    products:[]
   },
   reducers:{
    setProductData:(state,action)=>{
      return {products:[...state.products,...action.payload]}
    },
    setTheseProductsOnly:(state,action)=>{
      return {products:[...action.payload]}
    }
   }
})

export const {setProductData,setTheseProductsOnly} = ProductDataSlice.actions;