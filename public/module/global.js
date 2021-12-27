/**
 * SOLID.store
 */
class Store {
  /**
   * Hàm lấy dữ liệu từ store theo key
   * @param key khóa dữ liệu trong store
   * @returns trả về dữ liệu trong key
   */
  getState(key) {
    const storeKey = key.split('@')[0];
    if (window.SOLID.__STORE__) {
      return Object(window.SOLID.__STORE__)[storeKey];
    }
    return undefined;
  }
  /**
   * Hàm set dữ liệu vào store theo key
   * @param key khóa dữ liệu trong store
   * @param value giá trị mới
   * @returns this
   */
  dispatch(key, value) {
    const storeKey = key.split('@')[0];
    const nameSpace = key.split('@')[1] || 'all';
    /**
     * Hàm trigger đến toàn bộ funcion khi một key thay đổi
     * @param value giá trị trong store
     */
    const updateAllFunc = (value) => {
      const functions =
        nameSpace !== 'all'
          ? (Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] &&
              Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace]) ||
            []
          : Object.values(Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] || []).flat();
      for (const func of functions) {
        func(value);
      }
    };
    // Update value in store
    if (window.SOLID.__STORE__) {
      Object(window.SOLID.__STORE__)[storeKey] = value;
      updateAllFunc(value);
    }
    return this;
  }
  /**
   * Hàm lắng nghe một key nào đó thay đổi
   * @param key khóa dữ liệu trong store
   * @param func function callback
   * @returns this
   */
  subscribe(key, func) {
    const storeKey = key.split('@')[0];
    const nameSpace = key.split('@')[1] || 'all';
    Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] = Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] || {};
    Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace] =
      (Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] &&
        Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace]) ||
      [];
    Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] &&
      Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace].push(func);
    return this;
  }
  /**
   * Unsubscribe a listener of a key
   * @param key key in store
   * @param func listener need to unsubscribe
   * @returns this
   */
  unsubscribe(key, func) {
    const storeKey = key.split('@')[0];
    const nameSpace = key.split('@')[1] || 'all';
    if (!storeKey || !Object(window.SOLID.__ES_STORE_FUNC__)[storeKey]) {
      return this;
    }
    // destroy store key
    if (nameSpace === 'all' && !func) {
      return this.destroy(storeKey, false);
    }
    // find & remove matched function with store key
    if (nameSpace === 'all' && func) {
      for (const space in Object(window.SOLID.__ES_STORE_FUNC__)[storeKey]) {
        const functions = Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][space];
        for (let i = functions.length - 1; i >= 0; i--) {
          const funcItem = functions[i];
          if (funcItem === func) {
            Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace].splice(i, 1);
            break;
          }
        }
      }
      return this;
    }
    // destroy namespace in store key
    if (nameSpace !== 'all' && !func) {
      if (
        !Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] ||
        !Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace]
      ) {
        return this;
      }
      delete Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace];
      return this;
    }
    // find & remove matched function with nameSpace in store key
    if (nameSpace !== 'all' && func) {
      const functions =
        (Object(window.SOLID.__ES_STORE_FUNC__)[storeKey] &&
          Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace]) ||
        [];
      for (let i = functions.length - 1; i >= 0; i--) {
        const funcItem = functions[i];
        if (funcItem === func) {
          Object(window.SOLID.__ES_STORE_FUNC__)[storeKey][nameSpace].splice(i, 1);
          break;
        }
      }
      return this;
    }
    return this;
  }
  /**
   * Hàm remove lắng nghe một key nào đó thay đổi
   * @param storeKey khóa dữ liệu trong store
   * @param onlyFunc nếu chỉ muốn delete function
   * @returns this
   */
  destroy(storeKey, onlyFunc) {
    delete Object(window.SOLID.__ES_STORE_FUNC__)[storeKey];
    if (!onlyFunc) {
      delete Object(window.SOLID.__STORE__)[storeKey];
    }
    return this;
  }
}
export default Store;

('use strict');
// Init data func
window.SOLID = window.SOLID || {};
window.SOLID.__ES_STORE_FUNC__ = (window.SOLID && window.SOLID.__ES_STORE_FUNC__) || {};
window.SOLID.__STORE__ = (window.SOLID && window.SOLID.__STORE__) || {};
window.SOLID.store = new Store();
