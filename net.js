var callNet = function (_type, _url, _cb, _data) {
  function getXHR (URI) {
    return XMLHttpRequest;
  }

  var xhr = new (getXHR(_url));
  var contentType = null;
  var reqType = 'GET';
  var data = null;
  var getData = [];
  var errorCalled = false;

  if (_type.toUpperCase() === 'POST/JSON') {
    contentType = 'application/json';
    reqType = 'POST';
    data = JSON.stringify(_data);
  }
  else if (_type.toUpperCase() === 'POST') {
    if (_data) {
      Object.keys(_data).map(function (_dataKey) {
        data.push(_dataKey + '=' + encodeURIComponent(_data[_dataKey]));
      });
    }
    data = data.join('&');
    contentType = 'application/x-www-form-urlencoded';
  }
  else if (_type.toUpperCase() === 'GET' && _data && typeof _data === 'object') {

    Object.keys(_data).map(function (_dataKey) {
      getData.push(_dataKey + '=' + encodeURIComponent(_data[_dataKey]));
    });

    var urlParams = (_url.split('?')[1] || '').split('&');
    var url = _url.split('?')[0];

    if (urlParams[0] === '') {
      urlParams.shift();
    }

    urlParams = urlParams.concat(getData);

    if (urlParams.length > 0) {
      _url = url + '?' + urlParams.join('&');
    }
  }

  xhr.open(reqType, _url);

  xhr.onload = function () {
    if (this.status === 200) {
      _cb && _cb(null, this.responseText);
    }
    else {
      !errorCalled && _cb && _cb({status: this.status, statusText: this.statusText}, null);
      errorCalled = true;
    }
  };

  xhr.onerror = function () {
    !errorCalled && _cb && _cb({status: this.status, statusText: this.statusText}, null);
    errorCalled = true;
  };

  if (contentType && xhr instanceof XMLHttpRequest) {
    xhr.setRequestHeader('Content-Type', contentType);
  }

  xhr.send(data);
};