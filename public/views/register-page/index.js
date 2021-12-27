import api from '../../api/index.js';
import openNotification from '../../module/notification.js';

window.onload = function () {
  const $inputName = document.getElementById('input_name');
  const $inputEmail = document.getElementById('input_email');
  const $inputPassword = document.getElementById('input_password');
  const $inputCfPassword = document.getElementById('input_cf_password');

  // submit
  const $submitButton = document.getElementById('button_submit');
  $submitButton.addEventListener('click', (e) => {
    const name = $inputName.value;
    const email = $inputEmail.value;
    const password = $inputPassword.value;
    const cfPassword = $inputCfPassword.value;
    if (name && email && password && cfPassword) {
      e.preventDefault();
      if (password && password === cfPassword) {
        api({
          url: 'auth/register',
          method: 'POST',
          body: {
            name,
            email,
            password,
          },
        }).then((res) => {
          if (res.status === 'success') {
            openNotification('success', 'Register success');
            setTimeout(() => {
              window.location.href = '/login';
            }, 500);
          } else {
            openNotification('error', res.message);
          }
        });
      } else {
        openNotification('error', 'Confirm password is not same to password');
      }
    }
  });
};
