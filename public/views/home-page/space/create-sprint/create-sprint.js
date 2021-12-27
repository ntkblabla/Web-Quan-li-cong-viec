import api from '../../../../api/index.js';
import { formatDate } from '../../../../module/day.js';
import openNotification from '../../../../module/notification.js';
import SprintItem from '../sprint-item/sprint-item.js';

class CreateSprint {
  constructor() {
    this.$popup = document.querySelector('.create_sprint_popup');
    this.$startDate = this.$popup.querySelector('.start_date');
    this.$endDate = this.$popup.querySelector('.end_date');
    this.$nameSprint = this.$popup.querySelector('.name_sprint');
    this.$btnSubmit = this.$popup.querySelector('.create_sprint_btn');
    this.$spaceTemplate = document.querySelector('.space_template');
    this.$sprintItemTemp = this.$spaceTemplate.querySelector('.sprint_item');
    this.folderId = 0;
    this.index = 1;
    this.startDate = '';
    this.endDate = '';
    this.sprintName = '';
    // methods
    this.listen();
    this.close();
    this.listenInput();
    this.createSprint();
  }

  listen() {
    window.SOLID.store.subscribe('OPEN_CREATE_SPRINT_POPUP', (data) => {
      this.$popup.style.display = 'flex';
      this.folderId = data.folderId;
      this.index = data.sprintLength + 1;
    });
  }

  close() {
    const $bgClose = this.$popup.querySelector('.bg_close_popup');
    $bgClose.addEventListener('click', () => {
      this.closePopup();
    });
    const $closebtn = this.$popup.querySelector('.close_icon');
    $closebtn.addEventListener('click', () => {
      this.closePopup();
    });
  }

  closePopup() {
    this.$popup.style.display = '';
  }

  listenInput() {
    this.$startDate.addEventListener('change', (e) => {
      this.startDate = new Date(e.target.value);
      this.$nameSprint.value = `Sprint ${this.index} (${this.startDate ? formatDate(this.startDate) : ''} - ${
        this.endDate ? formatDate(this.endDate) : ''
      })`;
    });
    this.$endDate.addEventListener('change', (e) => {
      if (this.validateEndDate(e.target.value)) {
        this.endDate = new Date(e.target.value);
        this.$nameSprint.value = `Sprint ${this.index} (${this.startDate ? formatDate(this.startDate) : ''} - ${
          this.endDate ? formatDate(this.endDate) : ''
        })`;
      }
    });
  }

  validateEndDate(date) {
    if (this.startDate.getTime() - new Date(date).getTime() >= 0) {
      openNotification('error', 'End date must be greater than start date!');
      this.$endDate.value = '';
      return false;
    }
    return true;
  }

  createSprint() {
    this.$btnSubmit.addEventListener('click', (e) => {
      this.sprintName = this.$nameSprint.value;
      if (this.endDate && this.startDate && this.sprintName) {
        e.preventDefault();
        const data = {
          startAt: this.startDate,
          endAt: this.endDate,
          name: this.sprintName,
          status: 'process',
          index: this.index,
        };
        api({
          url: `folders/${this.folderId}/sprints`,
          method: 'POST',
          body: data,
        }).then((res) => {
          if (res.status === 'success') {
            this.appendSprintToDom(res.result);
            // update store
            const currentSprints = window.SOLID.store.getState('sprintList');
            const folderList = window.SOLID.store.getState('folderList');
            const activeFolder = folderList.find((folder) => +folder.id === +res.result.folderId);
            window.SOLID.store.dispatch('sprintList', [
              ...currentSprints,
              {
                ...res.result,
                countTask: 0,
                spaceId: activeFolder.spaceId,
              },
            ]);
            //
            this.closePopup();
            this.resetState();
            openNotification('success', 'Create sprint success!');
          } else {
            openNotification('error', res.message);
          }
        });
      }
    });
  }

  appendSprintToDom(sprint) {
    const $newSprint = this.$sprintItemTemp.cloneNode(true);
    $newSprint.style.display = 'flex';
    $newSprint.setAttribute('data-id', sprint.id);
    const $name = $newSprint.querySelector('.sprint_item_name');
    $name.innerHTML = sprint.name;
    const $count = $newSprint.querySelector('.sprint_item_task_number');
    $count.innerHTML = sprint.countTask || 0;
    const $activeFolder = document.querySelector(`.folder[data-id='${this.folderId}']`);
    const $sprintList = $activeFolder.querySelector('.sprint_list');
    const $iconDown = $activeFolder.querySelector('.toggle_icon');
    $sprintList.style.display = 'block';
    $iconDown.style.transform = 'rotate(0deg)';
    new SprintItem($newSprint);
    $sprintList.append($newSprint);
  }

  resetState() {
    this.$startDate.value = '';
    this.$endDate.value = '';
    this.$nameSprint.value = '';
  }
}

export default CreateSprint;
