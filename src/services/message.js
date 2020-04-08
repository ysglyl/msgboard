import post from '../utils/post'

/**
 *  获取列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpMessagePageList(params) {
  return post('/msgboard/message/pageList', params);
}

export async function httpMessageSave(params) {
  return post('/msgboard/message/save', params);
}

export async function httpMessageUpdate(params) {
  return post('/msgboard/message/update', params);
}
