import { createSlice } from "@reduxjs/toolkit";

export const PaginationSlice = createSlice( {
  name:'pagination',
  initialState:{
   pagination:{
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
    setPagination:(state,action)=>{
        return {pagination:{...state.pagination,...action.payload}}
    }
  }
})

export  const {setPagination} = PaginationSlice.actions;
