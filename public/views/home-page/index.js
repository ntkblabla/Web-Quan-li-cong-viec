import { checkToken, getUserInfo } from '../../module/checkAuth.js';
import commonSettingsScript from './common-settings/common-settings.js';
import CreateSpace from './space/create-space/create-space.js';
import CreateFolder from './space/create-folder/create-folder.js';
import Space from './space/space.js';
import SpaceItem from './space/space-item/space-item.js';
import CreateSprint from './space/create-sprint/create-sprint.js';
import Navbar from './tasks/navbar/navbar.js';
import api from '../../api/index.js';
import TasksContent from './tasks/tasks.js';
import TaskDetail from './task-detail/task-detail.js';
import { activeContent } from '../../module/active-tab.js';
import { getInfoWorkspace } from '../../module/getWorkspaceId.js';

window.onload = function () {
  window.user = getUserInfo();
  checkToken();
  renderUserAvatar();
  commonSettingsScript();
  getInfoWorkspace();
  navItemSidebarEvent();
  initStore();
  // create space
  new CreateSpace();
  // space event
  new Space();
  initEventSpaceItem();
  // create folder
  new CreateFolder();
  // create sprint
  new CreateSprint();
  // change nav bar content
  new Navbar();
  // content side
  new TasksContent();
  // task detail
  new TaskDetail();
};

const initEventSpaceItem = () => {
  const $spaceWrapper = document.querySelector('.space_wrapper');
  const $spaceItems = $spaceWrapper.querySelectorAll('.space');
  $spaceItems.forEach(($item) => {
    new SpaceItem($item);
  });
};

/**
 * renderUserAvatar
 */
const renderUserAvatar = () => {
  const $wrapperSettings = document.getElementsByClassName('settings')[0];
  const $userAvatar = $wrapperSettings.getElementsByClassName('user_avatar')[0];
  const $userName = $userAvatar.getElementsByClassName('user_name')[0];
  $userName.innerHTML = window.user.name[0].toUpperCase();
};

const initStore = () => {
  const workspaceId = window.SOLID.store.getState('workspaceId');
  api({
    url: `workspaces/${workspaceId}/spaces`,
    method: 'GET',
  }).then((res) => {
    if (res.status === 'success') {
      const spaceList = res.result;
      let folderList = [];
      spaceList.forEach((space) => {
        const newFolders = space.folders.map((folder) => {
          return {
            ...folder,
            spaceId: space.id,
          };
        });
        folderList = [...folderList, ...newFolders];
      });
      let sprintList = [];
      folderList.forEach((folder) => {
        const newSprints = folder.sprints.map((sprint) => {
          return {
            ...sprint,
            folderId: folder.id,
            spaceId: folder.spaceId,
          };
        });
        sprintList = [...sprintList, ...newSprints];
      });
      window.SOLID.store.dispatch('spaceList', spaceList);
      window.SOLID.store.dispatch('folderList', folderList);
      window.SOLID.store.dispatch('sprintList', sprintList);
    }
  });
  api({
    url: `/workspaces/${workspaceId}/users`,
    method: 'GET',
  }).then((res) => {
    if (res.status === 'success') {
      const members = res.result;
      window.SOLID.store.dispatch('workspaceMembers', members);
    }
  });
};

// const listenActiveFolderOrSprint = () => {
//   const $folderList = document.querySelectorAll('.folder');
//   $folderList.forEach(($folder) => {
//     const folderId = $folder.getAttribute('data-id');
//     const $titleFolder = $folder.querySelector('.title');
//     $titleFolder.addEventListener('click', () => {
//       activeContent($titleFolder);
//       window.SOLID.store.dispatch('activeContent', {
//         id: folderId,
//         type: 'folder',
//       });
//     });
//     const $sprintItems = $folder.querySelectorAll('.sprint_item');
//     $sprintItems.forEach(($sprint) => {
//       $sprint.addEventListener('click', () => {
//         const sprintId = $sprint.getAttribute('data-id');
//         activeContent($sprint);
//         window.SOLID.store.dispatch('activeContent', {
//           id: sprintId,
//           type: 'sprint',
//         });
//       });
//     });
//   });
// };

const navItemSidebarEvent = () => {
  const $navItemSideBars = document.querySelectorAll('.nav_item_side_bar');
  $navItemSideBars.forEach(($item) => {
    $item.addEventListener('click', () => {
      activeContent($item);
    });
  });
};
