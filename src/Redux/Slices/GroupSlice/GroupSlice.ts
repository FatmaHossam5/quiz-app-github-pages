import { createSlice } from "@reduxjs/toolkit";

interface GroupState {
  groups: object[] | null;
}

const initialState: GroupState = {
  groups: null,
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroup: (state, action) => {
      state.groups = action.payload;
    },
  },
});

export const { setGroup } = groupSlice.actions;
export default groupSlice.reducer;
