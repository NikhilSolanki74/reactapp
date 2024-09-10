import { createSlice } from "@reduxjs/toolkit";

export const UserCartSlice = createSlice( {
  name:'cart',
  initialState:{
   cart:{
    itemCount:0,
    itemsId:{},
    userId:'',
    tag:false,
    
}
  },
  reducers:{
    setCart:(state,action)=>{
        return {cart:{...state.cart,...action.payload}}
    },
    reset:()=>{
      return {cart:{itemCount:0,itemId:[],userId:'',tag:false}}
    }
  }
})

export  const {setCart,reset} = UserCartSlice.actions;
