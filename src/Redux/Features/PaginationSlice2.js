import { createSlice } from "@reduxjs/toolkit";

export const PaginationSlice2 = createSlice( {
  name:'pagination',
  initialState:{
   pagination2:{
    page:1,
    pages:1,
    limit:12,
    offset:0,
    next:true,
    prev:false,
    count:0,
    fr:true
}
  },
  reducers:{
    setPagination2:(state,action)=>{
        return {pagination2:{...state.pagination2,...action.payload}}
    }
  }
})

export  const {setPagination2} = PaginationSlice2.actions;
