const openNotification = (type, title) => {
  const $cacheNotification = document.getElementById('notification');
  if ($cacheNotification) {
    $cacheNotification.remove();
  }
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="notification" class="position_fixed top_40 padding_20 border_radius_4 z_index_1001 modal_notification " style="background: ${
      type === 'success' ? '#077064' : '#cc212c'
    };box-shadow: ${
    type === 'success' ? '0px 0px 5px #01645a' : '0px 0px 5px #cc212c'
  };left: 50%;transform: translateX(-50%)">
       <span className="color_white" style="color: white;">${title}</span>  
    </div>
    `;
  const $notification = wrapper;
  document.body.appendChild($notification);
  clearTimeout(window.timeoutNotification);
  window.timeoutNotification = setTimeout(() => {
    document.getElementById('notification')?.remove();
  }, 4000);
};

export default openNotification;
