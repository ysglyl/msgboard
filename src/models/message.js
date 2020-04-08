import {httpMessagePageList, httpMessageSave, httpMessageUpdate} from "../services/message";


export default {
  namespace: 'message',

  state: {},

  effects: {
    * messagePageListWithCallback({payload, callback}, {call}) {
      const res = yield call(httpMessagePageList, payload)
      if (callback && typeof callback === 'function') {
        callback(res)
      }
    },
    * messageSave({payload, callback}, {call}) {
      const res = yield call(httpMessageSave, payload);
      if (callback && typeof callback === 'function') {
        callback(res)
      }
    },
    * messageUpdate({payload, callback}, {call}) {
      yield call(httpMessageUpdate, payload);
    },
  },

  reducers: {}
}
