import axios, { AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { RecordingRules } from '../../types';

export const apiClient = axios.create({
  baseURL: process.env.REAC_APP_BASE_URL ?? '/',
  headers: {
    'content-type': 'application/json',
  },
});

export const getToken = (
  user_identity: string,
  room_name: string,
  create_room = true,
  create_conversation = process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true',
  passcode?: string
) => apiClient.post('token', { user_identity, room_name, create_room, create_conversation, passcode });

export const updateRecordingRules = (room_sid: string, rules: RecordingRules) =>
  apiClient.post('recordingrules', { rules, room_sid });

export const useInterceptor = (
  fn: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  deps: any[] // DependencyList[]
) => {
  useEffect(() => {
    const inderceptorId = apiClient.interceptors.request.use(fn);
    return () => {
      apiClient.interceptors.request.eject(inderceptorId);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};
