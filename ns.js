function createNS (_namespace, _scope, _data, _namespaceType) {
  var namespaceSeparator = _namespaceType || '.';
  var nsparts = _namespace.split(namespaceSeparator);
  var current = _scope || window;

  function nspartsMapHandler (_nspart, _index, _arr) {
    if (typeof current === 'object' && !(_nspart in current)) {
      if (_arr.length === (_index + 1) && _data) {
        current[_nspart] = _data;
      }
      else {
        current[_nspart] = {};
      }
    }

    if (_index + 1 < _arr.length && (typeof current[_nspart] !== 'object' && typeof current[_nspart] !== 'function')) {
      current[_nspart] = {};
    }

    current = current[_nspart];
  }
  nsparts.map(nspartsMapHandler);

  return current;
}

function getNS (_namespace, _scope, _namespaceType) {
  if (_namespace) {
    var namespaceSeparator = _namespaceType || '.';
    var nsparts = _namespace.split(namespaceSeparator);
    var current = _scope || window;

    function nspartsMapHandler (_nspart) {

      if (current === null || !(_nspart in current)) {
        current = null;
      }
      else {
        current = current[_nspart];
      }
    }
    nsparts.map(nspartsMapHandler);

    return current;
  }
  else {
    return null;
  }
}