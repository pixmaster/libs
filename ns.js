/**
 * @description Create object by path and return last node from path.
 * @param {String} _namespace Path in scope
 * @param {Object|null} [_scope] Target object
 * @param {*} [_data] It if need append data to last node immediately
 * @param {String} [_namespaceSeparator="."] Namespace separator
 * @returns {Object}
 */
function createNS (_namespace, _scope, _data, _namespaceSeparator) {
  var namespaceSeparator = _namespaceSeparator || '.';
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

/**
 * @description Get data from last node by path.
 * @param {String} _namespace Path in scope
 * @param {Object} _scope Target object
 * @param {String} [_namespaceSeparator="."] Namespace separator
 * @returns {Object|null}
 */
function getNS (_namespace, _scope, _namespaceSeparator) {
  if (_namespace && _scope) {
    var namespaceSeparator = _namespaceSeparator || '.';
    var nsparts = _namespace.split(namespaceSeparator);
    var current = _scope;

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