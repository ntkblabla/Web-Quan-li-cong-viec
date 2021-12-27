const renderComponent = (path, tagName, callback) => {
  fetch(path)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.querySelector(tagName).innerHTML = data;
      callback && callback();
    });
};

export default renderComponent;
