import api from '../../../api/index.js';
import { formatDateToString } from '../../../module/day.js';
import AddTask from './items/add-task.js';
import EditAssign from './items/edit-assign/edit-assign.js';
import EditEstimate from './items/edit-estimate/edit-estimate.js';
import EditStatusTask from './items/edit-status/edit-status.js';
import TaskItem from './task-item/task-item.js';
import TaskSprint from './task-sprint/task-sprint.js';

class TasksContent {
  constructor() {
    new EditStatusTask();
    new EditAssign();
    new EditEstimate();
    this.$contentTask = document.querySelector('.content_task');
    // this.$taskContainerAll = this.$contentTask.querySelector('.task_container_all');
    // this.$sprintItem = this.$contentTask.querySelector('.sprint_item');
    // this.$taskProcessTemp = this.$contentTask.querySelector('.task_list ');
    this.$contentTaskWrapper = this.$contentTask.querySelector('.content_task_wrapper');
    this.$taskSprintTemp = this.$contentTask.querySelector('.sprint_stasks');
    this.addEventAddStatusTask();
    this.listenRenderTasks();
    this.allTasksData = [];
    this.activeSprintData = null;
    this.activeFolderData = null;
  }

  addEventAddStatusTask() {
    const $addStatusTaskItems = this.$contentTask.querySelectorAll('.add_task');
    $addStatusTaskItems.forEach(($addTaskItem) => {
      new AddTask($addTaskItem);
    });
  }

  // lắng nghe khi thay click vào folder hoặc sprint thì render ra các task theo sprint
  listenRenderTasks() {
    window.SOLID.store.subscribe('activeContent', (data) => {
      if (data.type === 'sprint') {
        const sprintList = window.SOLID.store.getState('sprintList');
        if (sprintList && sprintList.length) {
          const activeSprint = sprintList.find((sprint) => +sprint.id === +data.id);
          // cached
          if (+this.activeSprintData?.id !== +activeSprint.id) {
            // reset cached folder
            this.activeFolderData = null;
            this.activeSprintData = activeSprint;
            this.renderSprintTask([activeSprint]);
            this.addEventAddStatusTask();
          }
        }
      } else {
        const folderList = window.SOLID.store.getState('folderList');
        if (folderList && folderList.length) {
          const activeFolder = folderList.find((folder) => +folder.id === +data.id);
          if (+this.activeFolderData?.id !== +activeFolder.id) {
            // reset cached sprint
            this.activeSprintData = null;
            this.activeFolderData = activeFolder;
            const listSprint = activeFolder.sprints.map((sprint) => {
              return {
                ...sprint,
                spaceId: activeFolder.spaceId,
              };
            });
            this.renderSprintTask(listSprint);
            this.addEventAddStatusTask();
          }
        }
      }
    });
  }

  renderSprintTask(sprintLists) {
    this.$contentTaskWrapper.innerHTML = '';
    const listSprintTaskDoms = [];
    sprintLists.forEach((sprint) => {
      const $newSprintTask = this.$taskSprintTemp.cloneNode(true);
      $newSprintTask.style.display = 'block';
      $newSprintTask.setAttribute('data-id', sprint.id);
      this.renderTitleSprint($newSprintTask, sprint);
      this.getAllTasks($newSprintTask, sprint);
      new TaskSprint($newSprintTask, sprint);
      listSprintTaskDoms.push($newSprintTask);
    });
    this.$contentTaskWrapper.append(...listSprintTaskDoms);
  }

  renderTitleSprint($sprintItem, sprint) {
    const $sprintTitleName = $sprintItem.querySelector('.sprint_item_title_name');
    $sprintTitleName.innerHTML = sprint.name;
    const $sprintStart = $sprintItem.querySelector('.sprint_item_start');
    const $sprintEnd = $sprintItem.querySelector('.sprint_item_end');
    $sprintStart.innerHTML = formatDateToString(sprint.startAt);
    $sprintEnd.innerHTML = formatDateToString(sprint.endAt);
  }

  getAllTasks($newSprintTask, activeSprint) {
    api({
      url: `spaces/${activeSprint.spaceId}/sprints/${activeSprint.id}/tasks`,
      method: 'GET',
    }).then((res) => {
      if (res.status === 'success') {
        this.allTasksData = res.result;
        this.renderTasks($newSprintTask, res.result);
      }
    });
  }

  renderTasks($newSprintTask, taskProcesses) {
    const $taskContainerAll = $newSprintTask.querySelector('.task_container_all');
    const $taskProcessTemp = $newSprintTask.querySelector('.task_list');
    const allTaskProcesses = [];
    taskProcesses.forEach((process) => {
      const $taskProcess = $taskProcessTemp.cloneNode(true);
      $taskProcess.style.display = 'block';
      $taskProcess.setAttribute('data-id', process.id);
      $taskProcess.setAttribute('data-complete-status', process.isCompleted);
      this.renderTitleProcess($taskProcess, process);
      this.renderTaskItems($taskProcess, process);
      allTaskProcesses.push($taskProcess);
    });
    $taskContainerAll.append(...allTaskProcesses);
  }

  renderTitleProcess($taskProcess, process) {
    const $taskListName = $taskProcess.querySelector('.task_list_title_name');
    const $taskListCount = $taskProcess.querySelector('.task_list_count');
    $taskListName.style.backgroundColor = process.color;
    $taskListName.innerHTML = process.name;
    $taskListCount.innerHTML = process.tasks.length + ' Tasks';
  }

  renderTaskItems($taskProcess, process) {
    const $taskWrapper = $taskProcess.querySelector('.task_process_wrapper');
    const $taskItemTemp = $taskProcess.querySelector('.task_item');
    const allTaskItems = [];
    process.tasks.forEach((task) => {
      const $newTaskItem = $taskItemTemp.cloneNode(true);
      new TaskItem($newTaskItem, task, process);
      allTaskItems.push($newTaskItem);
    });
    $taskWrapper.append(...allTaskItems);
  }
}

export default TasksContent;
