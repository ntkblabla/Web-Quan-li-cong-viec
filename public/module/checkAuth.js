export const setCookie = (name, value) => {
  document.cookie = name + '=' + (value || '') + '; path=/';
};

export const getCookie = (cname) => {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const checkToken = () => {
  const token = getCookie('auth');
  if (!token) {
    window.location.href = '/login';
  }
};

export const getUserInfo = () => {
  return {
    name: getCookie('name'),
    useId: getCookie('userId'),
    email: getCookie('email'),
  };
};

export const clearAuth = () => {
  setCookie('name', '');
  setCookie('userId', '');
  setCookie('email', '');
  setCookie('auth', '');
};
