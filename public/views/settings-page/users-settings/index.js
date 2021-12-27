import api from '../../../api/index.js';
import { getUserInfo } from '../../../module/checkAuth.js';
import { getInfoWorkspace } from '../../../module/getWorkspaceId.js';
import openNotification from '../../../module/notification.js';

class UserWorkspaceSettings {
  constructor() {
    getInfoWorkspace();
    this.$workSpaceSettings = document.querySelector('.workspace-settings-page');
    this.addEventSubmit();
  }

  addEventSubmit() {
    const $buttonSubmit = this.$workSpaceSettings.querySelector('.invite_btn');
    const $inputName = this.$workSpaceSettings.querySelector('.input_member');
    // const $inputColor = this.$workSpaceSettings.querySelector();

    $buttonSubmit.addEventListener('click', (e) => {
      const email = $inputName.value;
      if (email) {
        const data = {
          email,
        };
        e.preventDefault();
        api({
          url: `workspaces/${window.SOLID.store.getState('workspaceId')}/members`,
          method: 'POST',
          body: data,
        })
          .then((res) => {
            if (res.status === 'success') {
              openNotification('success', 'Update workspace success!');
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
  window.user = getUserInfo();
  new UserWorkspaceSettings();
};
