import { createSlice } from "@reduxjs/toolkit";

export const MyOrdersSlice = createSlice( {
  name:'orders',
  initialState:{
   orders:[]
  },
  reducers:{
    setOrders:(state,action)=>{
        return {orders:[...action.payload]}
    },
    reset:()=>{
      return {orders:[]}
    }
  }
})

export  const {setOrders,reset} = MyOrdersSlice.actions;