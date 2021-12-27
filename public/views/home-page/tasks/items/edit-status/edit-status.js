import api from '../../../../../api/index.js';
import TaskItem from '../../task-item/task-item.js';

class EditStatusTask {
  constructor() {
    this.$editStatus = document.querySelector('.edit_status_task');
    this.$editStatusContent = this.$editStatus.querySelector('.edit_status_task_content');
    this.$bgClose = this.$editStatus.querySelector('.bg_close_edit_status_task');
    this.$statusTemp = this.$editStatus.querySelector('.edit_status_task_item');
    this.$statusWrapper = this.$editStatus.querySelector('.edit_status_task_wrapper');
    this.$currentStatusEdit = null;
    this.listen();
    this.editTaskData = null;
    this.type = 'add';
  }

  listen() {
    window.SOLID.store.subscribe('OPEN_EDIT_STATUS_TASK', (data) => {
      this.type = data.type;
      this.editTaskData = data.data;
      this.$currentStatusEdit = data.dom;
      this.$editStatus.style.display = 'block';
      this.$editStatusContent.style.top = data.top + 15 + 'px';
      this.$editStatusContent.style.left = data.left + 'px';
      const statuses = window.SOLID.store.getState('spaceProcesses');
      this.renderStatus(statuses);
      this.listenTaskUpdate();
    });
    this.$bgClose.addEventListener('click', () => {
      this.closePopup();
    });
  }

  renderStatus(statuses) {
    this.$statusWrapper.innerHTML = '';
    const activeStatus = statuses?.processes?.activeProcesses;
    const completeStatus = statuses?.processes?.completeProcesses;
    const activeStatusDoms = [];
    const completeStatusDoms = [];
    activeStatus.forEach((status) => {
      const $newStatus = this.$statusTemp.cloneNode(true);
      $newStatus.setAttribute('data-id', status.id);
      $newStatus.style.display = 'flex';
      $newStatus.querySelector('.color').style.background = status.color;
      $newStatus.querySelector('.name').innerHTML = status.name;
      $newStatus.addEventListener('click', () => {
        this.closePopup();
        this.update(status.id, status.color);
      });
      activeStatusDoms.push($newStatus);
    });
    completeStatus.forEach((status) => {
      const $newStatus = this.$statusTemp.cloneNode(true);
      $newStatus.setAttribute('data-id', status.id);
      $newStatus.style.display = 'flex';
      $newStatus.querySelector('.color').style.background = status.color;
      $newStatus.querySelector('.name').innerHTML = status.name;
      $newStatus.addEventListener('click', () => {
        this.closePopup();
        this.update(status.id, status.color);
      });
      completeStatusDoms.push($newStatus);
    });
    this.$statusWrapper.append(...activeStatusDoms);
    this.$statusWrapper.append(...completeStatusDoms);
  }

  closePopup() {
    this.$editStatus.style.display = '';
  }

  update(statusId, statusColor) {
    if (this.type === 'add') {
      this.$currentStatusEdit.setAttribute('value', statusId);
      this.$currentStatusEdit.style.backgroundColor = statusColor;
    } else {
      const updateData = {
        ...this.editTaskData,
        processId: statusId,
      };
      this.updateTask(this.editTaskData.id, updateData);
    }
  }

  updateToDom(task) {
    const $taskItem = document.querySelector(`.task_item[data-id='${task.id}']`);
    const $newTaskItem = $taskItem.cloneNode(true);
    $taskItem.remove();
    new TaskItem($newTaskItem, task, task.process);
    const $taskProcessWrapper = document
      .querySelector(`.sprint_stasks[data-id="${task.sprintId}"]`)
      .querySelector(`.task_list[data-id="${task.processId}"]`)
      .querySelector('.task_process_wrapper');
    $taskProcessWrapper.append($newTaskItem);
  }

  updateTask(id, task) {
    task.id && delete task.id;
    delete task.process;
    delete task.sprint;
    api({
      url: `tasks/${id}`,
      method: 'PUT',
      body: {
        processId: task.processId,
      },
    }).then((res) => {
      if (res.status === 'success') {
        console.log('update: ', res.result);
        this.updateToDom(res.result);
        window.SOLID.store.dispatch('TASK_UPDATE', res.result);
      }
    });
  }

  listenTaskUpdate() {
    // window.SOLID.store.unsubscribe('TASK_UPDATE', this.listenUpdatedata);
    // window.SOLID.store.subscribe('TASK_UPDATE', this.listenUpdatedata);
  }
}

export default EditStatusTask;
