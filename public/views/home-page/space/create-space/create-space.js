import api from '../../../../api/index.js';
import openNotification from '../../../../module/notification.js';
import SpaceItem from '../space-item/space-item.js';

class CreateSpace {
  name;
  color;
  $addSpaceWrapper;
  $buttonAddSpace;
  $popup;
  step;
  isCreatingStatus;
  statusOrder;
  activeStatuses;
  completeStatus;
  isCreatePreStatus;
  statusEdit;

  constructor() {
    this.$spaceItemTemp = document.querySelector('.space_template').querySelector('.space');
    this.$spaceWrapperContainer = document.querySelector('.space_wrapper_container');
    // attributes
    this.initData();
    // init methods
    this.addEventOpenPopup();
    this.addEventClosePopup();
    // step 2
    this.addEventClickColor();
    // step 3
    this.addEventCreateStatus();
    this.addEventUpdateStatus();
    // step 4
    this.addEventSubmitCreateSpace();
  }

  initData() {
    this.name = '';
    this.color = '#7b68ee';
    this.$addSpaceWrapper = document.getElementById('add_new_space_wrapper');
    this.$buttonAddSpace = this.$addSpaceWrapper.getElementsByClassName('button_add_space')[0];
    this.$popup = this.$addSpaceWrapper.getElementsByClassName('create_space_popup')[0];
    this.step = 'name';
    this.isCreatingStatus = false;
    this.statusOrder = 1;
    this.activeStatuses = [];
    this.isCreatePreStatus = false;
    this.statusAddedEvent = [];
    this.$stepStatus = this.$popup.querySelector('.step_task_status');
    this.statusEdit = {};
    this.completeStatus = {};
    // init step
    this.initStep();
  }

  /**
   * addEventOpenPopup: mở popup
   */
  addEventOpenPopup() {
    this.$buttonAddSpace.addEventListener('click', () => {
      this.$popup.style.display = 'flex';
    });
  }

  /**
   * addEventClosePopup dóng popup
   */
  addEventClosePopup() {
    const $closeIcon = this.$popup.getElementsByClassName('close_icon')[0];
    $closeIcon.addEventListener('click', () => {
      this.$popup.style.display = '';
    });
    const $bgClosePopup = this.$popup.getElementsByClassName('bg_close_popup')[0];
    $bgClosePopup.addEventListener('click', () => {
      this.$popup.style.display = '';
    });
  }

  /**
   * init: khởi tạo các step
   */
  initStep() {
    this.renderStep(this.step);
    this.addEventChangeStep();
  }

  /**
   * renderStep
   * @param step: step mấy
   */
  renderStep(step) {
    this.hiddenAllStep();
    switch (step) {
      case 'name': {
        const $stepName = this.$popup.querySelector('.step_create_name');
        $stepName.style.display = 'block';
        break;
      }
      case 'color': {
        this.renderAvatarSpaceAtStepColor();
        const $stepColor = this.$popup.querySelector('.step_create_color');
        $stepColor.style.display = 'block';
        break;
      }
      case 'statuses': {
        if (!this.isCreatePreStatus) {
          this.preCreateStatus();
        }
        const $stepStatus = this.$popup.querySelector('.step_task_status');
        $stepStatus.style.display = 'block';
        break;
      }
      case 'finish': {
        this.$stepFinish = this.$popup.querySelector('.step_finish');
        this.renderFinishInfo();
        this.$stepFinish.style.display = 'block';
        break;
      }
    }
  }

  /**
   * hiddenAllStep: ẩn tất cả các step
   */
  hiddenAllStep() {
    const $steps = document.getElementsByClassName('step_create_space');
    for (let i = 0; i < $steps.length; i++) {
      const $step = $steps[i];
      $step.style.display = '';
    }
  }

  /**
   * addEventChangeStep: sự kiện thay đổi step
   */
  addEventChangeStep() {
    // next to color
    const $nextToColorBtn = this.$popup.querySelector('.next_to_step_color');
    const $nameSpace = this.$popup.querySelector('.name_space');
    $nextToColorBtn.addEventListener('click', (e) => {
      if ($nameSpace?.value) {
        this.name = $nameSpace.value;
        e.preventDefault();
        this.step = 'color';
        this.renderStep(this.step);
      }
    });
    // back to name
    const $backToStepName = this.$popup.querySelector('.back_to_step_name');
    $backToStepName.addEventListener('click', () => {
      this.step = 'name';
      this.renderStep(this.step);
    });
    // next to status
    const $nextToStepBtn = this.$popup.querySelector('.next_to_task_status');
    $nextToStepBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.step = 'statuses';
      this.renderStep(this.step);
    });
    // back to color
    const $backToStepColor = this.$popup.querySelector('.back_to_step_color');
    $backToStepColor.addEventListener('click', () => {
      this.step = 'color';
      this.renderStep(this.step);
    });
    // next to finish
    const $nextToStepFinish = this.$popup.querySelector('.next_to_step_finish');
    $nextToStepFinish.addEventListener('click', (e) => {
      e.preventDefault();
      this.step = 'finish';
      this.renderStep(this.step);
    });
    // back to status
    const $backToStepStatus = this.$popup.querySelector('.back_to_step_status');
    $backToStepStatus.addEventListener('click', () => {
      this.step = 'statuses';
      this.renderStep(this.step);
    });
  }

  /**
   * renderAvatarSpaceAtStepColor: render ra avatar của space
   */
  renderAvatarSpaceAtStepColor() {
    const $stepColor = this.$popup.querySelector('.step_create_color');
    // change name
    const $stepColorAvatar = $stepColor.querySelector('.space_avatar');
    if (this.name) {
      $stepColorAvatar.innerHTML = this.name[0].toUpperCase();
    }
    $stepColorAvatar.style.background = this.color;
    // change color active at color picker
    const $colorPickerActive = $stepColor.querySelector('.color_picker.active');
    $colorPickerActive.classList.remove('active');
    const $activeColorPicker = $stepColor.querySelector(`.color_picker[value="${this.color}"]`);
    $activeColorPicker.classList.add('active');
  }

  /**
   * addEventClickColor: sự kiện thay dổi color
   */
  addEventClickColor() {
    const $stepColor = this.$popup.querySelector('.step_create_color');
    // change color
    const $colorPickers = $stepColor.querySelectorAll('.color_picker');
    for (let i = 0; i < $colorPickers.length; i++) {
      const $colorPicker = $colorPickers[i];
      $colorPicker.addEventListener('click', () => {
        const $currentActive = $stepColor.querySelector('.color_picker.active');
        $currentActive.classList.remove('active');
        $colorPicker.classList.add('active');
        this.color = $colorPicker.getAttribute('value');
        // render Avatar
        this.renderAvatarSpaceAtStepColor();
      });
    }
  }

  /**
   * addEventCreateStatus: sự kiện tạo statuss
   */
  addEventCreateStatus() {
    const $stepStatus = this.$popup.querySelector('.step_task_status');
    // event input
    const $input = $stepStatus.querySelector('.input_add_status');
    $input.addEventListener('blur', () => {
      this.isCreatingStatus = false;
      if ($input.value) {
        this.callApiCreateStatus(
          {
            name: $input.value,
          },
          $stepStatus,
        );
      }
      this.renderInputStatus($stepStatus);
    });
    $input.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        if ($input.value) {
          this.callApiCreateStatus(
            {
              name: $input.value,
            },
            $stepStatus,
          );
        }
      }
    });
    // add event click button
    const $buttonCreateSpace = $stepStatus.querySelector('.button_add_status');
    $buttonCreateSpace.addEventListener('click', () => {
      this.isCreatingStatus = true;
      this.renderInputStatus($stepStatus);
    });
    // event update color status
    const $changeColor = $stepStatus.querySelector('.change_color');
    const $bgCloseChangeColor = $changeColor.querySelector('.bg_close_change_color');
    $bgCloseChangeColor.addEventListener('click', () => {
      $changeColor.style.display = '';
    });
    this.addEventEditStatus();
  }

  /**
   * addEventEditStatus bật popup chỉnh sửa color hoac name
   */
  addEventEditStatus() {
    const $stepStatus = this.$popup.querySelector('.step_task_status');
    const $statusItems = $stepStatus.querySelectorAll('.status_item');
    const $changeColor = $stepStatus.querySelector('.change_color');
    for (let i = 0; i < $statusItems.length; i++) {
      const $statusItem = $statusItems[i];
      const statusId = $statusItem.getAttribute('data-id');
      const statusComplete = $statusItem.getAttribute('data-complete');
      if (!this.statusAddedEvent.includes(statusId)) {
        this.statusAddedEvent.push(statusId);
        $statusItem.addEventListener('click', () => {
          this.statusEdit.id = statusId;
          this.statusEdit.isCompleted = statusComplete === 'true';
          console.log(this.statusEdit);
        });
        // change color
        $statusItem.querySelector('.color').addEventListener('click', (e) => {
          const $colorPicker = $changeColor.querySelector('.color_picker_container');
          $colorPicker.querySelector('.color_picker.active').classList.remove('active');
          let activeStatus;
          if ($statusItem.getAttribute('data-complete') === 'false') {
            activeStatus = this.activeStatuses.find((item) => Number(item.id) === Number(statusId));
          } else {
            activeStatus = this.completeStatus;
          }
          $colorPicker.querySelector(`.color_picker[value="${activeStatus.color}"]`).classList.add('active');
          $colorPicker.style.left = $statusItem.getBoundingClientRect().left + 'px';
          $colorPicker.style.top = $statusItem.getBoundingClientRect().top - 72 + 'px';
          $changeColor.style.display = 'block';
        });
        // change name
        const $inputName = $statusItem.querySelector('.name');
        $inputName.addEventListener('blur', () => {
          if ($inputName.value) {
            if (this.statusEdit.isCompleted) {
              this.completeStatus.name = $inputName.value.toUpperCase();
            } else {
              this.activeStatuses = this.activeStatuses.map((status) => {
                if (Number(status.id) === Number(this.statusEdit.id)) {
                  return {
                    ...status,
                    name: $inputName.value.toUpperCase(),
                  };
                }
                return status;
              });
            }
          }
        });
        // delete
        this.addEventPopupEditStatus($statusItem);
      }
    }
  }

  /**
   * callApiCreateStatus: taọ 1 status
   */
  callApiCreateStatus(statusData, $stepStatus, callback) {
    api({
      url: 'processes',
      method: 'POST',
      body: {
        name: statusData?.name?.toUpperCase(),
        color: statusData?.color ?? '#7b68ee',
        order: this.statusOrder,
        isCompleted: statusData.isCompleted || false,
      },
    }).then((res) => {
      if (res.status === 'success') {
        this.appendStatusCreated(res.result, $stepStatus, statusData.isCompleted);
        this.addEventEditStatus();
        const $input = $stepStatus.querySelector('.input_add_status');
        $input.value = '';
        if (!statusData.isCompleted) {
          this.activeStatuses.push(res.result);
          this.statusOrder++;
        } else {
          this.completeStatus = res.result;
        }
        callback && callback();
      } else {
        openNotification('error', res.message);
      }
    });
  }

  appendStatusCreated(status, $stepStatus, isCompletedStatus) {
    const $statusItem = $stepStatus.querySelector('.status_item');
    const $newStatus = $statusItem.cloneNode(true);
    $newStatus.style.display = 'flex';
    $newStatus.querySelector('.color').style.backgroundColor = status.color;
    $newStatus.querySelector('.name').value = status.name;
    $newStatus.setAttribute('data-id', status.id);
    $newStatus.setAttribute('data-complete', status.isCompleted);
    if (!isCompletedStatus) {
      const $statusActiveWrapper = $stepStatus.querySelector('.status_active_list');
      $statusActiveWrapper.appendChild($newStatus);
    } else {
      const $statusDoneWrapper = $stepStatus.querySelector('.done_statuses');
      $statusDoneWrapper.appendChild($newStatus);
    }
  }

  /**
   * renderInputStatus: render ra input hoặc ẩn đi
   */
  renderInputStatus($stepStatus) {
    const $input = $stepStatus.querySelector('.input_add_status');
    const $buttonCreateSpace = $stepStatus.querySelector('.button_add_status');
    if (this.isCreatingStatus) {
      $input.style.display = 'block';
      $input.focus();
      $buttonCreateSpace.style.display = 'none';
    } else {
      $input.style.display = 'none';
      $input.value = '';
      $buttonCreateSpace.style.display = 'block';
    }
  }

  /**
   * preCreateStatus: tạo trước 2 status demo
   */
  preCreateStatus() {
    const preActiveStatus = {
      name: 'TODO',
      color: '#7b68ee',
      isCompleted: false,
    };
    const preCompleteStatus = {
      name: 'COMPLETE',
      color: '#2ea52c',
      isCompleted: true,
    };
    const $stepStatus = this.$popup.querySelector('.step_task_status');
    this.callApiCreateStatus(preActiveStatus, $stepStatus);
    this.callApiCreateStatus(preCompleteStatus, $stepStatus);
    this.isCreatePreStatus = true;
  }

  /**
   *
   */
  addEventUpdateStatus() {
    const $colorPikerStatus = this.$popup.querySelector('.color_picker_status');
    const $colorItems = $colorPikerStatus.querySelectorAll('.color_item');
    $colorItems.forEach(($colorItem) => {
      $colorItem.addEventListener('click', () => {
        const value = $colorItem.getAttribute('value');
        $colorPikerStatus.querySelector('.color_item.active').classList.remove('active');
        $colorItem.classList.add('active');
        this.$stepStatus
          .querySelector(`.status_item[data-id='${this.statusEdit.id}']`)
          .querySelector('.color').style.backgroundColor = value;
        if (this.statusEdit.isCompleted) {
          this.completeStatus.color = value;
        } else {
          this.activeStatuses = this.activeStatuses.map((status) => {
            if (Number(status.id) === Number(this.statusEdit.id)) {
              return {
                ...status,
                color: value,
              };
            }
            return status;
          });
        }
      });
    });
  }

  /**
   * addEventPopupEditStatus: tat bat popup edit status
   */
  addEventPopupEditStatus($statusItem) {
    const $buttonOpen = $statusItem.querySelector('.edit_popup');
    const $popupEdit = $statusItem.querySelector('.popup_edit ');
    const statusId = $statusItem.getAttribute('data-id');
    const isCompleteStatus = $statusItem.getAttribute('data-complete');
    $buttonOpen.addEventListener('click', () => {
      $popupEdit.style.display = 'block';
      if (isCompleteStatus === 'true') {
        $popupEdit.querySelector('.delete_status').remove();
      }
    });
    $popupEdit.querySelector('.bg_close_edit_status').addEventListener('click', () => {
      $popupEdit.style.display = '';
    });
    // rename
    $popupEdit.querySelector('.rename').addEventListener('click', () => {
      $statusItem.querySelector('.name').focus();
      $popupEdit.style.display = '';
    });
    // color
    $popupEdit.querySelector('.change_color_btn').addEventListener('click', (e) => {
      const $changeColor = this.$stepStatus.querySelector('.change_color');
      const $colorPicker = $changeColor.querySelector('.color_picker_container');
      $colorPicker.querySelector('.color_picker.active').classList.remove('active');
      let activeStatus;
      if (isCompleteStatus === 'false') {
        activeStatus = this.activeStatuses.find((item) => Number(item.id) === Number(statusId));
      } else {
        activeStatus = this.completeStatus;
      }
      $colorPicker.querySelector(`.color_picker[value="${activeStatus.color}"]`).classList.add('active');
      $colorPicker.style.left = $statusItem.getBoundingClientRect().left + 'px';
      $colorPicker.style.top = $statusItem.getBoundingClientRect().top - 72 + 'px';
      $changeColor.style.display = 'block';
      $popupEdit.style.display = '';
    });
    // delete
    if (isCompleteStatus === 'false') {
      $popupEdit.querySelector('.delete_status').addEventListener('click', () => {
        this.activeStatuses = this.activeStatuses.filter((item) => Number(item.id) !== Number(statusId));
        $statusItem.remove();
        $popupEdit.style.display = '';
      });
    }
  }

  /**
   * renderFinishInfo: render step 4
   */
  async renderFinishInfo() {
    const $name = this.$stepFinish.querySelector('.space_name');
    $name.innerHTML = this.name;
    const $avatar = this.$stepFinish.querySelector('.space_avatar');
    $avatar.style.backgroundColor = this.color;
    $avatar.innerHTML = this.name[0].toUpperCase();
    const $spaceStatus = this.$stepFinish.querySelector('.space_status');
    // reset
    const $oldSpaceStatuses = $spaceStatus.querySelectorAll('.show.space_status_item');
    $oldSpaceStatuses.forEach(($item) => {
      $item.remove();
    });
    // render
    const $statusItemTemp = $spaceStatus.querySelector('.space_status_item');
    const $listStatusItem = this.activeStatuses.map((item) => {
      const $statusItem = $statusItemTemp.cloneNode(true);
      $statusItem.style.display = 'block';
      $statusItem.style.backgroundColor = item.color;
      $statusItem.classList.add('show');
      $statusItem.setAttribute('title', item.name);
      return $statusItem;
    });
    const $statusItemComplete = $statusItemTemp.cloneNode(true);
    $statusItemComplete.style.display = 'block';
    $statusItemComplete.style.backgroundColor = this.completeStatus.color;
    $statusItemComplete.classList.add('show');
    $statusItemComplete.setAttribute('title', this.completeStatus.name);
    $listStatusItem.push($statusItemComplete);
    $spaceStatus.append(...$listStatusItem);
  }

  /**
   * callApiUpdateStatus
   */
  updateSpaceIdForStatus(updateData) {
    api({
      url: `processes/${updateData.id}`,
      method: 'POST',
      body: {
        ...updateData,
      },
    }).then((res) => {
      if (res.status === 'success') {
      } else {
        openNotification('error', res.message);
      }
    });
  }

  /**
   * addEventSubmitCreateSpace: tạo space
   */
  addEventSubmitCreateSpace() {
    const $btnSubmit = this.$popup.querySelector('.button_create_space');
    $btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.name && this.color) {
        const workspaceId = window.SOLID.store.getState('workspaceId');
        api({
          url: `workspaces/${workspaceId}/spaces`,
          method: 'POST',
          body: {
            name: this.name,
            color: this.color,
          },
        }).then((res) => {
          if (res.status === 'success') {
            const spaceId = res.result.id;
            this.activeStatuses.forEach((status) => {
              this.updateSpaceIdForStatus({
                ...status,
                spaceId,
              });
            });
            this.updateSpaceIdForStatus({
              ...this.completeStatus,
              spaceId,
            });
            this.initData();
            this.resetToInitState();
            this.appendSpaceToDom(res.result);
            // append to store
            const currentSpaces = window.SOLID.store.getState('spaceList');
            window.SOLID.store.dispatch('spaceList', [...currentSpaces, { ...res.result, folders: [] }]);
            //
            this.$popup.style.display = '';
            openNotification('success', 'Create space success!');
          } else {
            openNotification('error', res.message);
          }
        });
      }
    });
  }

  /**
   * resetToInitState: trở lại trạng thái ban đầu
   */
  resetToInitState() {
    //reset name
    const $stepName = this.$popup.querySelector('.step_create_name');
    $stepName.querySelector('.name_space').value = this.name;
    // reset color
    this.renderAvatarSpaceAtStepColor();
    // reset status
    const $statusCreated = this.$stepStatus.querySelectorAll('.status_item[data-id]');
    $statusCreated.forEach(($item) => {
      $item.remove();
    });
  }

  appendSpaceToDom(spaceInfo) {
    const $newSpace = this.$spaceItemTemp.cloneNode(true);
    $newSpace.style.display = 'block';
    $newSpace.setAttribute('data-id', spaceInfo.id);
    const $spaceColor = $newSpace.querySelector('.space_color');
    const $spaceName = $newSpace.querySelector('.space_name');
    $spaceColor.innerHTML = spaceInfo.name[0].toUpperCase();
    $spaceColor.style.backgroundColor = spaceInfo.color;
    $spaceName.innerHTML = spaceInfo.name;
    new SpaceItem($newSpace);
    this.$spaceWrapperContainer.append(...[$newSpace]);
  }
}

export default CreateSpace;
