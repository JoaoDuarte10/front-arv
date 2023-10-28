import { configureStore } from '@reduxjs/toolkit';
import clientReducer from '../reducers/clients-slice';
import { ClientsInterface } from '../service/api/client/types';
import authenticatedReducer, {
  UserLogin,
} from '../reducers/authenticated-slice';
import segmentReducer from '../reducers/segment-sclice';
import { SegmentInterface } from '../service/api/segment/types';

export const store = configureStore({
  reducer: {
    authenticated: authenticatedReducer,
    client: clientReducer,
    segment: segmentReducer,
  },
});

export type ReduceStore = {
  authenticated: UserLogin;
  client: ClientsInterface[];
  segment: SegmentInterface[];
};
