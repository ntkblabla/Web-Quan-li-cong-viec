import api from '../../../api/index.js';
import { getUserInfo } from '../../../module/checkAuth.js';
import { getInfoWorkspace } from '../../../module/getWorkspaceId.js';
import openNotification from '../../../module/notification.js';

class WorkSpaceSettings {
  constructor() {
    this.userId = '';
    this.name = '';
    this.color = '';
    getInfoWorkspace();
    this.$workSpaceSettings = document.querySelector('.workspace-settings-page');
    this.addEventSubmit();
  }

  addEventSubmit() {
    const $buttonSubmit = this.$workSpaceSettings.querySelector('.btn_save_workspace_name');
    const $inputName = this.$workSpaceSettings.querySelector("input[name='workspacename']");
    // const $inputColor = this.$workSpaceSettings.querySelector();

    $buttonSubmit.addEventListener('click', (e) => {
      const name = $inputName.value;
      if (name) {
        const data = {
          name,
        };
        e.preventDefault();
        api({
          url: `users/${window.user.useId}/workspaces/${window.SOLID.store.getState('workspaceId')}`,
          method: 'POST',
          body: data,
        })
          .then((res) => {
            if (res.status === 'success') {
              this.name = res.result.name;
              this.userId = res.result.userId;

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
  new WorkSpaceSettings();
};
