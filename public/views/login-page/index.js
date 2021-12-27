import api from '../../api/index.js';
import openNotification from '../../module/notification.js';

window.onload = function () {
  const $inputEmail = document.getElementById('input_email');
  const $inputPassword = document.getElementById('input_password');

  // submit
  const $submitButton = document.getElementById('button_submit');
  $submitButton.addEventListener('click', (e) => {
    const email = $inputEmail.value;
    const password = $inputPassword.value;
    if (email && password) {
      e.preventDefault();
      api({
        url: 'auth/login',
        method: 'POST',
        body: {
          email,
          password,
        },
      }).then((res) => {
        if (res.status === 'success') {
          document.cookie = `name=${res.result.name}`;
          document.cookie = `userId=${res.result.id}`;
          document.cookie = `email=${res.result.email}`;
          document.cookie = `auth=Bearer ${res.result.token}`;
          openNotification('success', 'Login success');
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        } else {
          openNotification('error', res.message);
        }
      });
    }
  });
};
