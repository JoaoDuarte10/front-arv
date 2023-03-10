import { createSlice } from "@reduxjs/toolkit";
import { ReducerActionType } from "./types/reducer-type";
import { ClientsInterface } from "../service/api/client/types";

const initialState: ClientsInterface[] = [];

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clientAdded: {
      reducer(
        state: ClientsInterface[],
        action: ReducerActionType<ClientsInterface[]>
      ) {
        action.payload.forEach(client => state.push(client));
      },
      prepare(
        params: ClientsInterface[]
      ): {
        payload: ClientsInterface[];
      } {
        return {
          payload: params.length
            ? params.map(client => {
                return {
                  idclients: client.idclients,
                  name: client.name,
                  email: client.email,
                  phone: client.phone,
                  segment: client.segment,
                  address: client.address,
                  addressNumber: client.addressNumber,
                  note: client.note,
                  created_at: client.created_at,
                  updated_at: client.updated_at
                };
              })
            : []
        };
      }
    },
    clearClient: {
      reducer(state: ClientsInterface[]) {
        state.splice(0, state.length);
      },
      prepare(): any {
        return {
          payload: {}
        };
      }
    }
  }
});

export const { clientAdded, clearClient } = clientSlice.actions;

export default clientSlice.reducer;
