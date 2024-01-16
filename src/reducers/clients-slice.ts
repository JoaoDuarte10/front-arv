import { createSlice } from '@reduxjs/toolkit';
import { ReducerActionType } from './types/reducer-type';
import { ClientsInterface } from '../service/api/client/types';

const initialState: ClientsInterface[] = [];

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clientAdded: {
      reducer(
        state: ClientsInterface[],
        action: ReducerActionType<ClientsInterface[]>,
      ) {
        action.payload.forEach(client => state.push(client));
      },
      prepare(
        params: ClientsInterface[],
      ): {
        payload: ClientsInterface[];
      } {
        return {
          payload: params.length
            ? params.map(client => {
                return {
                  id: client.id,
                  name: client.name,
                  email: client.email,
                  phone: client.phone,
                  segment: client.segment,
                  address: client.address,
                  note: client.note,
                  cpf: client.cpf,
                  cnpj: client.cnpj,
                  createdAt: client.createdAt,
                  updatedAt: client.updatedAt,
                };
              })
            : [],
        };
      },
    },
    clearClient: {
      reducer(state: ClientsInterface[]) {
        state.splice(0, state.length);
      },
      prepare(): any {
        return {
          payload: {},
        };
      },
    },
  },
});

export const { clientAdded, clearClient } = clientSlice.actions;

export default clientSlice.reducer;
