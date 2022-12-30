import { createSlice } from "@reduxjs/toolkit";
import { ReducerActionType } from "./types/reducer-type";
import { SegmentInterface } from "../service/segment";

const initialState: SegmentInterface[] = [];

const segmentSlice = createSlice({
  name: "segment",
  initialState,
  reducers: {
    segmentAdded: {
      reducer(
        state: SegmentInterface[],
        action: ReducerActionType<SegmentInterface[]>
      ) {
        action.payload.forEach(segment => state.push(segment));
      },
      prepare(
        params: SegmentInterface[]
      ): {
        payload: SegmentInterface[];
      } {
        return {
          payload: params.length
            ? params.map(segment => {
                return {
                  idsegments: segment.idsegments,
                  name: segment.name,
                  createdAt: segment.createdAt
                };
              })
            : []
        };
      }
    }
  }
});

export const { segmentAdded } = segmentSlice.actions;

export default segmentSlice.reducer;
