import { clearAuth, getCookie } from '../../../module/checkAuth.js';
import api from '../../../api/index.js';

/**
 * commonSettingsScript
 */
const commonSettingsScript = () => {
  callback();
};

const callback = () => {
  let workspaceList = [];
  const $wraperSettings = document.getElementsByClassName('wrapper_settings')[0];
  const $settings = document.getElementsByClassName('settings')[0];
  const $commonSettings = $wraperSettings.getElementsByClassName('common-settings')[0];

  /**
   * updateUserInfo update thông tin user
   */
  const updateUserInfo = () => {
    const $userInfo = $commonSettings.getElementsByClassName('user_info')[0];
    const $userName = $userInfo.getElementsByClassName('user_name')[0];
    const $userAvatar = $userInfo.getElementsByClassName('user_avatar')[0];
    $userName.innerHTML = window.user.name;
    $userAvatar.innerHTML = window.user.name[0].toUpperCase();
  };

  /**
   * addEventListen thêm sự kiện tắt mở settings
   */
  const addEventListen = () => {
    $settings.addEventListener('click', () => {
      const statusDisplay = $commonSettings.style.display;
      if (!statusDisplay || statusDisplay === 'none') {
        $commonSettings.style.display = 'block';
      } else {
        $commonSettings.style.display = '';
      }
    });
  };

  const onLogOut = () => {
    const $logout = $commonSettings.getElementsByClassName('logout')[0];
    $logout.addEventListener('click', () => {
      clearAuth();
      window.location.href = '/login';
    });
  };

  /**
   * getWorkspaceListByUser: lay all workspace cua 1 user
   */
  const getWorkspaceListByUser = () => {
    const userId = getCookie('userId');
    api({
      url: `users/${userId}/workspaces`,
      method: 'GET',
    }).then((res) => {
      if (res.status === 'success') {
        if (res?.result?.length) {
          workspaceList = res.result;
          renderAllWorkspaceDoms();
        } else {
          window.location.href = '/create-workspace';
        }
      } else {
        openNotification('error', res.message);
      }
    });
  };

  /**
   * renderAllWorkspaceDoms: render tat ca cac workspace
   */
  const renderAllWorkspaceDoms = () => {
    const $workspaceWrapper = document.getElementsByClassName('workspaces')[0];
    const $workspaceItemTemplate = $workspaceWrapper.getElementsByClassName('workspaces_item')[0];
    const $allWorkspaces = workspaceList.map((workspace) => {
      const $newWorkspace = $workspaceItemTemplate.cloneNode(true);
      $newWorkspace.style.backgroundColor = workspace.color;
      $newWorkspace.innerHTML = workspace.name[0].toUpperCase();
      $newWorkspace.setAttribute('href', `/workspaces/${workspace.id}`);
      $newWorkspace.setAttribute('data-value', workspace.id);
      return $newWorkspace;
    });
    $workspaceItemTemplate.style.display = 'none';
    $workspaceWrapper.prepend(...$allWorkspaces);
    activeWorkspace();
  };

  /**
   * activeWorkspace
   */
  const activeWorkspace = () => {
    const workspaceId = window.SOLID.store.getState('workspaceId');
    setActiveWorkspace(workspaceId);
    window.SOLID.store.subscribe('workspaceId', (workspaceId) => {
      setActiveWorkspace(workspaceId);
    });
  };

  const setActiveWorkspace = (workspaceId) => {
    if (workspaceId) {
      const $workspaceWrapper = document.getElementsByClassName('workspaces')[0];
      const $workspaceList = $workspaceWrapper.getElementsByClassName('workspaces_item');
      for (let i = 0; i < $workspaceList.length; i++) {
        const $workspace = $workspaceList[i];
        if ($workspace.getAttribute('data-value') === workspaceId) {
          $workspace.classList.add('box_shadow_red');
          $workspace.classList.add('border_width_2');
          $workspace.classList.add('border_color_white');
          $workspace.classList.add('border_style_solid');
        }
      }
    }
  };

  /* run script */
  getWorkspaceListByUser();
  updateUserInfo();
  addEventListen();
  onLogOut();
};

export default commonSettingsScript;
