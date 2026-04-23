import { useCookie } from 'nuxt/app';
import { customRef, watch } from 'vue';

interface EncryptOptions {
  secret: string;
  iv: string;
  // 直接返回密文，默认false
  getCiphertext?: boolean;
}

/**
 * 存储时加密 cookie 增加cookie破解难度
 * @description 加密存储cookie，cookie值会自动加密存储，获取时会自动解密
 * @param name cookie名称
 * @param encryptOpt 加密选项
 * @param opts cookie选项
 * @returns cookie 正确的值
 * */
export function useEncodedCookie<T = any | null>(
  name: string,
  encryptOpt: EncryptOptions,
  opts?: Parameters<typeof useCookie<string>>[1]
) {
  const { readonly = false, ...restOpts } = opts || {};
  const { getCiphertext = false } = encryptOpt;
  const safetyValue = useCookie<string | null | undefined>(name, {
    ...restOpts,
    readonly: false,
  });

  const cookie = customRef<T>((track, trigger) => {
    return {
      get: () => {
        track();
        if (!safetyValue.value) {
          return null as T;
        }
        if (getCiphertext) {
          return safetyValue.value as T;
        }
        try {
          return decryptValue<T>(safetyValue.value, encryptOpt);
        } catch (error) {
          return null as T;
        }
      },
      set: (value) => {
        if (readonly) {
          return;
        }
        if (!value && value !== 0 && value !== '') {
          safetyValue.value = value as any;
        } else {
          safetyValue.value = encryptValue<T>(value, encryptOpt);
        }
        trigger();
      },
    };
  });

  watch(safetyValue, (newVal) => {
    if (newVal) {
      cookie.value = decryptValue<T>(newVal, encryptOpt);
    }
  });

  return cookie;
}
