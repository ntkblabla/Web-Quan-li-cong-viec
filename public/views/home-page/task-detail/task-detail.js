import api from '../../../api/index.js';
import { formatDateToString, fullFormatDateToString } from '../../../module/day.js';

class TaskDetail {
  constructor() {
    this.$popup = document.querySelector('.task_detail_popup');
    this.$taskDetailSprintTitle = this.$popup.querySelector('.task_detail_sprint_title');
    this.$taskDetailStatus = this.$popup.querySelector('.task_detail_status');
    this.$taskAssign = this.$popup.querySelector('.task_detail_assign');
    this.$assigner = this.$popup.querySelector('.assigner');
    this.$assignerIcon = this.$popup.querySelector('.icon_add_assigner');
    this.$createdAt = this.$popup.querySelector('.task_detail_created_at_content');
    this.$dueDate = this.$popup.querySelector('.task_detail_duedate_content');
    this.$dueDateInput = this.$popup.querySelector('.task_detail_duedate_input');
    this.$estimate = this.$popup.querySelector('.task_detail_estimate_content');
    this.$estimateInput = this.$popup.querySelector('.task_detail_estimate_input');
    this.$taskDetailContent = this.$popup.querySelector('.task_detail_content');
    this.$taskTitle = this.$taskDetailContent.querySelector('.task_detail_title');
    this.$taskDesc = this.$taskDetailContent.querySelector('.task_detail_desc');
    this.$taskResult = this.$taskDetailContent.querySelector('.task_detail_result_input');
    this.$bgClose = this.$popup.querySelector('.bg_close_popup');
    this.$btnClose = this.$popup.querySelector('.close_icon');
    this.activeTaskDetail = {};
    this.listenOpen();
    this.listenClose();
    this.listenChangeTitle();
    this.listenChangeDesc();
    this.listenChangeResult();
    this.listenChangeStatus();
    this.listenChangeDueDate();
    this.listenChangeAssign();
    this.listenChangeEstimate();
    //
    this.listenUpdateDom();
  }

  listenOpen() {
    window.SOLID.store.subscribe('OPEN_TASK_DETAIL', (task) => {
      this.$popup.style.display = 'flex';
      const process = this.getProcess(task.processId);
      this.activeTaskDetail = {
        ...task,
        process,
      };
      this.renderContent();
      this.getTaskDetail(task.id);
    });
  }

  renderContent() {
    // sprint name
    this.$taskDetailSprintTitle.innerHTML = this.activeTaskDetail.sprint.name;
    // status
    this.$taskDetailStatus.innerHTML = this.activeTaskDetail.process.name;
    this.$taskDetailStatus.style.backgroundColor = this.activeTaskDetail.process.color;
    // assigner
    // this.$taskDetailSprintTitle.innerHTML = this.activeTaskDetail.sprint.name;
    const userTasks = this.activeTaskDetail.userTasks;
    const $usersDom = this.$taskAssign.querySelectorAll('.assigner');
    $usersDom.forEach(($item) => {
      const id = $item.getAttribute('data-id');
      $item.style.display = 'none';
      if (id) {
        $item.remove();
      }
    });
    if (userTasks?.length) {
      userTasks.forEach((userTask) => {
        const $newAssignValue = this.$assigner.cloneNode(true);
        $newAssignValue.style.display = 'flex';
        $newAssignValue.setAttribute('data-id', userTask.id);
        $newAssignValue.innerHTML = userTask.user.name[0].toUpperCase();
        this.$taskAssign.append($newAssignValue);
      });
      this.$assignerIcon.style.display = 'none';
    } else {
      this.$assignerIcon.style.display = '';
    }
    // created at
    this.$createdAt.innerHTML = fullFormatDateToString(this.activeTaskDetail.createdAt);
    // estimate
    if (this.activeTaskDetail.estimateTime) {
      this.$estimate.innerHTML = this.activeTaskDetail.estimateTime + 'h';
      this.$estimate.style.display = '';
      this.$estimateInput.style.display = '';
    } else {
      this.$estimate.style.display = 'none';
      this.$estimateInput.style.display = 'block';
    }
    // duedate
    if (this.activeTaskDetail.dueDate) {
      this.$dueDate.innerHTML = formatDateToString(this.activeTaskDetail.dueDate);
      this.$dueDate.style.display = '';
      this.$dueDateInput.style.display = '';
    } else {
      this.$dueDate.style.display = 'none';
      this.$dueDateInput.style.display = 'block';
    }
    // title
    this.$taskTitle.value = this.activeTaskDetail.title;
    this.$taskDesc.value = this.activeTaskDetail.description || '';
    this.$taskResult.innerHTML = this.activeTaskDetail.result || '';
  }

  listenClose() {
    this.$bgClose.addEventListener('click', () => {
      this.closePopup();
    });
    this.$btnClose.addEventListener('click', () => {
      this.closePopup();
    });
  }

  closePopup() {
    this.$popup.style.display = '';
  }

  listenChangeTitle() {
    const $title = this.$popup.querySelector('.task_detail_title');
    $title.addEventListener('blur', () => {
      const data = {
        title: $title.value,
      };
      this.updateTask(this.activeTaskDetail.id, data);
    });
  }

  listenChangeDesc() {
    const $desc = this.$popup.querySelector('.task_detail_desc');
    $desc.addEventListener('blur', () => {
      const data = {
        description: $desc.value,
      };
      this.updateTask(this.activeTaskDetail.id, data);
    });
  }

  listenChangeResult() {
    const $result = this.$popup.querySelector('.task_detail_result_input');
    $result.addEventListener('blur', () => {
      const data = {
        result: $result.value,
      };
      this.updateTask(this.activeTaskDetail.id, data);
    });
  }

  listenChangeStatus() {
    this.$taskDetailStatus.addEventListener('click', () => {
      const $taskItem = document
        .querySelector(`.task_item[data-id='${this.activeTaskDetail.id}']`)
        .querySelector('.task_item_status');
      const relativePos = this.$taskDetailStatus.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_STATUS_TASK', {
        top: relativePos.top + 20,
        left: relativePos.left,
        dom: $taskItem,
        type: 'edit',
        data: this.activeTaskDetail,
      });
    });
  }

  listenChangeDueDate() {
    const $taskChooseDueDate = this.$popup.querySelector('.task_detail_choose_duedate');
    $taskChooseDueDate.addEventListener('change', (e) => {
      const data = {
        dueDate: new Date(e.target.value),
      };
      this.updateTask(this.activeTaskDetail.id, data);
    });
  }

  listenChangeEstimate() {
    const $estimateContainer = this.$popup.querySelector('.task_detail_estimate');
    $estimateContainer.addEventListener('click', () => {
      const relativePos = $estimateContainer.getBoundingClientRect();
      const $taskItem = document
        .querySelector(`.task_item[data-id='${this.activeTaskDetail.id}']`)
        .querySelector('.task_item_estimate');
      window.SOLID.store.dispatch('OPEN_EDIT_ESTIMATE_TASK', {
        top: relativePos.top,
        left: relativePos.left,
        dom: $taskItem,
        type: 'edit',
        data: this.activeTaskDetail,
      });
    });
  }

  listenChangeAssign() {
    this.$taskAssign.addEventListener('click', () => {
      const $taskItem = document
        .querySelector(`.task_item[data-id='${this.activeTaskDetail.id}']`)
        .querySelector('.task_item_assign');
      const relativePos = this.$taskAssign.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_ASSIGN_TASK', {
        top: relativePos.top,
        left: relativePos.left,
        dom: $taskItem,
        type: 'edit',
        data: this.activeTaskDetail,
      });
    });
  }

  listenUpdateDom() {
    window.SOLID.store.subscribe('TASK_UPDATE', (data) => {
      if (+this.activeTaskDetail.id === +data.id && this.$popup.style.display === 'flex') {
        this.activeTaskDetail = data;
        this.renderContent();
      }
    });
  }

  getProcess(id) {
    const spaceProcesses = window.SOLID.store.getState('spaceProcesses');
    const activeProcess = spaceProcesses?.processes?.activeProcesses || [];
    const completeProcess = spaceProcesses?.processes?.completeProcesses || [];
    for (let i = 0; i < activeProcess.length; i++) {
      const process = activeProcess[i];
      if (+process.id === +id) {
        return process;
      }
    }
    for (let i = 0; i < completeProcess.length; i++) {
      const process = completeProcess[i];
      if (+process.id === +id) {
        return process;
      }
    }
  }

  getTaskDetail(id) {
    api({
      url: `tasks/${id}`,
      method: 'GET',
    }).then((res) => {
      if (res.status === 'success') {
        this.activeTaskDetail = res.result;
        this.renderContent();
      }
    });
  }

  updateTask(id, task) {
    api({
      url: `tasks/${id}`,
      method: 'PUT',
      body: task,
    }).then((res) => {
      if (res.status === 'success') {
        window.SOLID.store.dispatch('TASK_UPDATE', res.result);
      }
    });
  }
}

export default TaskDetail;
