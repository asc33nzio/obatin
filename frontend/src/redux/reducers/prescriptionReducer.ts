import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PrescriptionState {
  usedPrescriptionIDs: Array<number>;
}

const initialState: PrescriptionState = {
  usedPrescriptionIDs: [],
};

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    addUsedPrescription(state, action: PayloadAction<number>) {
      const prescriptionID = action.payload;

      if (state.usedPrescriptionIDs.includes(prescriptionID)) {
        return;
      }

      state.usedPrescriptionIDs.push(prescriptionID);
    },

    resetPrescriptionState(state) {
      state.usedPrescriptionIDs = [];
    },
  },
});

export const { addUsedPrescription, resetPrescriptionState } =
  prescriptionSlice.actions;
export const prescriptionReducer = prescriptionSlice.reducer;
