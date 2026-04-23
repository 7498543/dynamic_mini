import { H3Event, getCookie, setCookie } from 'h3';

interface EncryptOptions {
  secret: string;
  iv: string;
}

/**
 * 存储时加密 cookie 增加cookie破解难度
 * @description 加密存储cookie，cookie值会自动加密存储，获取时会自动解密
 * @param event h3事件对象
 * @param name cookie名称
 * @param encryptOpt 加密选项
 * @returns cookie 正确的值
 * */
export function getEncodedCookie<T = any | null>(
  event: H3Event<globalThis.EventHandlerRequest>,
  name: string,
  encryptOpt: EncryptOptions
) {
  const cookie = getCookie(event, name);
  if (cookie) {
    return decryptValue(cookie, encryptOpt);
  }
  return null;
}
/**
 * 存储时加密 cookie 增加cookie破解难度
 * @description 加密存储cookie，cookie值会自动加密存储，获取时会自动解密
 * @param event h3事件对象
 * @param name cookie名称
 * @param encryptOpt 加密选项
 * @returns cookie 正确的值
 * */
export function setEncodedCookie<T = any | null>(
  event: H3Event<globalThis.EventHandlerRequest>,
  name: string,
  value: T,
  encryptOpt: EncryptOptions,
  opt: Parameters<typeof setCookie>[3]
) {
  if (value === null) {
    return null;
  }
  const encryptedValue = encryptValue(value, encryptOpt);
  setCookie(event, name, encryptedValue, opt);
}
