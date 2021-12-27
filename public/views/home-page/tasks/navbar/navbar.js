import api from '../../../../api/index.js';

class Navbar {
  constructor() {
    this.$navbar = document.querySelector('.navbar_content');
    this.$activeIcon = this.$navbar.querySelector('.icon_active');
    this.$activeName = this.$navbar.querySelector('.name_active');
    this.$activeList = this.$navbar.querySelector('.number_list_active');
    this.activeContent = {};
    this.listenChangeActiveContent();
  }

  listenChangeActiveContent() {
    window.SOLID.store.subscribe('activeContent', (activeContent) => {
      this.activeContent = activeContent;
      const sprintList = window.SOLID.store.getState('sprintList');
      const folderList = window.SOLID.store.getState('folderList');
      if (this.activeContent.type === 'sprint') {
        const activeSprint = sprintList?.find((sprint) => Number(sprint.id) === Number(this.activeContent.id));
        // get process
        const activeFolder = folderList?.find((folder) => Number(folder.id) === Number(activeSprint.folderId));
        this.getProcesses(activeFolder.spaceId);
        // replace view
        this.$activeIcon.innerHTML = `<i class="fas fa-repeat-alt"></i>`;
        this.$activeName.innerHTML = activeSprint.name;
        this.$activeList.innerHTML = 0 + ' Lists';
      } else {
        const activeFolder = folderList?.find((folder) => Number(folder.id) === Number(this.activeContent.id));
        // get process
        this.getProcesses(activeFolder.spaceId);
        // view
        this.$activeIcon.innerHTML = `<i class="fas fa-folder"></i>`;
        this.$activeName.innerHTML = activeFolder.name;
        this.$activeList.innerHTML = (activeFolder?.sprints?.length || 0) + ' Lists';
      }
    });
  }

  getProcesses(spaceId) {
    const spaceProcesses = window.SOLID.store.getState('spaceProcesses');
    if (!spaceProcesses || +spaceProcesses?.spaceId !== +spaceId) {
      api({
        url: `spaces/${spaceId}/processes`,
        method: 'GET',
      }).then((res) => {
        if (res.status === 'success') {
          window.SOLID.store.dispatch('spaceProcesses', {
            processes: res.result,
            spaceId: Number(spaceId),
          });
        }
      });
    }
  }
}

export default Navbar;
