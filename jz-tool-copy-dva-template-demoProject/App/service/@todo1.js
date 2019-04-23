/** 接口模版 */
import { get, post, postJson } from '@/service/base';

/** todo */
export async function getTodo1(params) {
  return get('/todo', params);
}

/** todo */
export async function getTodo2(id, params) {
    return get(`/todo/${id}`, params);
  }

/** todo */
export async function postTodo1(params) {
  return postJson('/todo', params);
}

/** todo */
export async function getTodo2(params, data) {
  return postJson(`/todo/${params}/todo`, data);
}

/** todo */
export async function getTodo3(params, data) {
  return post('/todo', data);
}

/** todo */
export async function getTodo4(params, data) {
  return post(`/todo/${params}/todo`, data);
}