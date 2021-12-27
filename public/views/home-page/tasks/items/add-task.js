import api from '../../../../api/index.js';
import { formatDate } from '../../../../module/day.js';
import openNotification from '../../../../module/notification.js';
import TaskItem from '../task-item/task-item.js';

class AddTask {
  constructor($element) {
    this.$addTask = $element;
    this.$changeStatus = this.$addTask.querySelector('.add_task_status');
    this.$changeAssigner = this.$addTask.querySelector('.add_task_user');
    this.$changeNameTask = this.$addTask.querySelector('.add_task_name');
    this.$changeDuedateTask = this.$addTask.querySelector('.due_date');
    this.$changeEstimateTask = this.$addTask.querySelector('.add_task_estimate');
    this.$duedate = this.$addTask.querySelector('.add_task_due_date');
    this.$buttonSubmit = this.$addTask.querySelector('.add_task_btn');
    this.$buttonClose = this.$addTask.querySelector('.add_task_cancel');
    this.activeSprintId = this.$addTask.closest('.sprint_stasks').getAttribute('data-id');
    this.listenOpenEditStatus();
    this.listenOpenEditAssigner();
    this.listenOpenEditEstimate();
    this.listenChangeDueDate();
    this.listenSubmit();
    this.listenClose();
  }

  listenOpenEditStatus() {
    const statusList = window.SOLID.store.getState('spaceProcesses');
    statusList?.activeProcesses && this.activeProcesses(statusList);
    window.SOLID.store.subscribe('spaceProcesses', (process) => {
      this.initStatus(process);
    });

    this.$changeStatus.addEventListener('click', () => {
      const relativePos = this.$changeStatus.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_STATUS_TASK', {
        top: relativePos.top,
        left: relativePos.left,
        dom: this.$changeStatus,
        type: 'add',
      });
    });
  }

  initStatus(process) {
    const activeProcesses = process?.processes?.activeProcesses || [];
    const firstStatus = activeProcesses[0];
    this.$changeStatus.setAttribute('value', firstStatus.id);
    this.$changeStatus.style.backgroundColor = firstStatus.color;
  }

  listenOpenEditAssigner() {
    this.$changeAssigner.addEventListener('click', () => {
      const relativePos = this.$changeAssigner.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_ASSIGN_TASK', {
        top: relativePos.top,
        left: relativePos.left,
        dom: this.$changeAssigner,
        type: 'add',
      });
    });
  }

  listenOpenEditEstimate() {
    this.$changeEstimateTask.addEventListener('click', () => {
      const relativePos = this.$changeEstimateTask.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_ESTIMATE_TASK', {
        top: relativePos.top,
        left: relativePos.left,
        dom: this.$changeEstimateTask,
        type: 'add',
      });
    });
  }

  listenChangeDueDate() {
    this.$changeDuedateTask.addEventListener('change', (e) => {
      const $dueDateValue = this.$duedate.querySelector('.add_task_due_date_value');
      const $dueDateInput = this.$duedate.querySelector('.add_task_due_date_input');
      $dueDateValue.innerHTML = formatDate(e.target.value);
      $dueDateValue.style.display = 'block';
      $dueDateInput.style.display = 'none';
    });
  }

  listenSubmit() {
    this.$buttonSubmit.addEventListener('click', (e) => {
      const title = this.$changeNameTask.value;
      const processId = Number(this.$changeStatus.getAttribute('value'));
      const sprintId = this.activeSprintId;
      const userId = this.$changeAssigner.getAttribute('value');
      const dueDate = this.$changeDuedateTask.value;
      const estimateTime = this.$changeEstimateTask.getAttribute('value');
      const data = {
        title,
        processId,
        sprintId,
        userId,
        dueDate,
        estimateTime,
      };
      if (title) {
        e.preventDefault();
        api({
          url: `sprints/${sprintId}/tasks`,
          method: 'POST',
          body: data,
        }).then((res) => {
          if (res.status === 'success') {
            this.appendTaskToDom(res.result);
            openNotification('success', 'Create task successfully');
            this.close();
            this.resetState();
          }
        });
      }
    });
  }

  appendTaskToDom(task) {
    const $taskProcess = document
      .querySelector(`.sprint_stasks[data-id='${task.sprintId}']`)
      .querySelector(`.task_list[data-id='${task.processId}']`);
    const $taskWrapper = $taskProcess.querySelector('.task_process_wrapper');
    const $taskItemTemp = $taskProcess.querySelector('.task_item');
    const $newTaskItem = $taskItemTemp.cloneNode(true);
    new TaskItem($newTaskItem, task, task.process);
    $taskWrapper.append($newTaskItem);
  }

  listenClose() {
    this.$buttonClose.addEventListener('click', () => {
      this.close();
    });
  }

  close() {
    this.$addTask.style.display = '';
  }

  resetState() {
    const process = window.SOLID.store.getState('spaceProcesses');
    this.initStatus(process);
    this.$changeNameTask.value = '';
    this.$changeAssigner.setAttribute('value', '');
    this.$changeAssigner.querySelector('.icon_add_assigner').style.display = '';
    this.$changeAssigner.querySelector('.assigner').style.display = '';
    this.$changeDuedateTask.value = '';
    this.$changeEstimateTask.setAttribute('value', '');
  }
}

export default AddTask;
