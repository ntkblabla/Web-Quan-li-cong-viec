import api from '../../../api/index.js';
import openNotification from '../../../module/notification.js';

class MySettings {
  constructor() {
    this.name = '';
    this.email = '';
    this.newPassword = '';
    this.id = '';
    this.$mySettings = document.querySelector('.my-settings-page');
    this.callAPIGetUserInfo();
    this.addEventSubmit();
  }

  callAPIGetUserInfo() {
    api({
      url: 'me',
      method: 'GET',
    })
      .then((res) => {
        if (res.status === 'success') {
          this.name = res.result.name;
          this.email = res.result.email;
          this.id = res.result.id;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  addEventSubmit() {
    const $buttonSubmit = this.$mySettings.querySelector('.btn_save_user_info');
    const $inputName = this.$mySettings.querySelector("input[name='fullname']");
    const $inputEmail = this.$mySettings.querySelector("input[name='email']");
    const $inputNewPassword = this.$mySettings.querySelector("input[name='password']");
    $buttonSubmit.addEventListener('click', (e) => {
      const name = $inputName.value;
      const email = $inputEmail.value;
      const newPassword = $inputNewPassword.value;
      if (name && email) {
        const data = {
          name,
          email,
        }
        if (newPassword) {
          data.password = newPassword;
        }
        e.preventDefault();
        api({
          url: `users/${this.id}`,
          method: 'POST',
          body: data,
        })
          .then((res) => {
            if (res.status === 'success') {
              this.name = res.result.name;
              this.email = res.result.email;
              this.id = res.result.id;
              if (newPassword) {
                $inputNewPassword.value = ""
              }
              openNotification('success', 'Update profile success!');
            } else {
              openNotification('error', res.message);
            }
          })
          .catch((e) => {
            openNotification('error', e.message);
          });
      }
    });
  }
}

window.onload = function () {
  new MySettings();
};
