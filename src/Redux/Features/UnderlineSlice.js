import { createSlice } from "@reduxjs/toolkit";

export const UnderlineSlice = createSlice( {
  name:'line',
  initialState:{
    l1:true,
    l2:false,
    l3:false,
    l4:false
  },
  reducers:{
    setLine:(state,action)=>{
        switch(action.payload){
          case 0:
            state.l1=false;
            state.l2=false;
            state.l3=false;
            state.l4=false;

            break;
            case 1:
            state.l1=true;
            state.l2=false;
            state.l3=false;
            state.l4=false;

           break;

           case 2:
            state.l1=false;
            state.l2=true;
            state.l3=false;
            state.l4=false;

           break;
            case 3:
            state.l1=false;
            state.l2=false;
            state.l3=true;
            state.l4=false;

            break;
            case 4:
            state.l1=false;
            state.l2=false;
            state.l3=false;
            state.l4=true;
            break;
        }
    }
  }
})

export  const {setLine} = UnderlineSlice.actions;
