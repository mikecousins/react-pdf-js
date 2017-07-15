'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('pdfjs-dist/build/pdf.combined');
require('pdfjs-dist/web/compatibility');

var makeCancelable = function makeCancelable(promise) {
  var hasCanceled = false;

  var wrappedPromise = new _promise2.default(function (resolve, reject) {
    promise.then(function (val) {
      return hasCanceled ? reject({ pdf: val, isCanceled: true }) : resolve(val);
    });
    promise.catch(function (error) {
      return hasCanceled ? reject({ isCanceled: true }) : reject(error);
    });
  });

  return {
    promise: wrappedPromise,
    cancel: function cancel() {
      hasCanceled = true;
    }
  };
};

var Pdf = function (_React$Component) {
  (0, _inherits3.default)(Pdf, _React$Component);
  (0, _createClass3.default)(Pdf, null, [{
    key: 'onDocumentError',
    value: function onDocumentError(err) {
      if (err.isCanceled && err.pdf) {
        err.pdf.destroy();
      }
    }

    // Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
    // use window.btoa' step and without risking a blow of the stack. According to [Jon Leightons's]
    // tests, this appears to be a faster approach: http://jsperf.com/encoding-xhr-image-data/5
    // Jon Leighton https://gist.github.com/jonleighton/958841

  }, {
    key: 'defaultBinaryToBase64',
    value: function defaultBinaryToBase64(arrayBuffer) {
      var base64 = '';
      var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

      var bytes = new Uint8Array(arrayBuffer);
      var byteLength = bytes.byteLength;
      var byteRemainder = byteLength % 3;
      var mainLength = byteLength - byteRemainder;

      var a = void 0;
      var b = void 0;
      var c = void 0;
      var d = void 0;
      var chunk = void 0;

      // Main loop deals with bytes in chunks of 3
      for (var i = 0; i < mainLength; i += 3) {
        // Combine the three bytes into a single integer
        chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 = [base64, encodings[a], encodings[b], encodings[c], encodings[d]].join('');
      }

      // Deal with the remaining bytes and padding
      if (byteRemainder === 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1

        base64 = [base64, encodings[a], encodings[b], '=='].join('');
      } else if (byteRemainder === 2) {
        chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1

        base64 = [base64, encodings[a], encodings[b], encodings[c], '='].join('');
      }

      return base64;
    }
  }]);

  function Pdf(props) {
    (0, _classCallCheck3.default)(this, Pdf);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Pdf.__proto__ || (0, _getPrototypeOf2.default)(Pdf)).call(this, props));

    _this.state = {};
    _this.onGetPdfRaw = _this.onGetPdfRaw.bind(_this);

    if (!(typeof _this.onGetPdfRaw === 'function')) {
      throw new TypeError('Value of "this.onGetPdfRaw" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.onGetPdfRaw));
    }

    _this.onDocumentComplete = _this.onDocumentComplete.bind(_this);

    if (!(typeof _this.onDocumentComplete === 'function')) {
      throw new TypeError('Value of "this.onDocumentComplete" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.onDocumentComplete));
    }

    _this.onPageComplete = _this.onPageComplete.bind(_this);

    if (!(typeof _this.onPageComplete === 'function')) {
      throw new TypeError('Value of "this.onPageComplete" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.onPageComplete));
    }

    _this.getDocument = _this.getDocument.bind(_this);

    if (!(typeof _this.getDocument === 'function')) {
      throw new TypeError('Value of "this.getDocument" violates contract.\n\nExpected:\n(any) => any\n\nGot:\n' + _inspect(_this.getDocument));
    }

    return _this;
  }

  (0, _createClass3.default)(Pdf, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadPDFDocument(this.props);
      this.renderPdf();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var pdf = this.state.pdf;


      var newDocInit = newProps.documentInitParameters;
      var docInit = this.props.documentInitParameters;

      // Only reload if the most significant source has changed!
      var newSource = newProps.file;
      var oldSource = newSource ? this.props.file : null;
      newSource = newSource || newProps.binaryContent;
      oldSource = newSource && !oldSource ? this.props.binaryContent : oldSource;
      newSource = newSource || newProps.content;
      oldSource = newSource && !oldSource ? this.props.content : oldSource;

      if (newSource && newSource !== oldSource && (newProps.file && newProps.file !== this.props.file || newProps.content && newProps.content !== this.props.content || newDocInit && newDocInit !== docInit || newDocInit && docInit && newDocInit.url !== docInit.url)) {
        this.loadPDFDocument(newProps);
      }

      if (pdf && (newProps.page && newProps.page !== this.props.page || newProps.scale && newProps.scale !== this.props.scale || newProps.rotate && newProps.rotate !== this.props.rotate)) {
        this.setState({ page: null });
        pdf.getPage(newProps.page).then(this.onPageComplete);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var pdf = this.state.pdf;

      if (pdf) {
        pdf.destroy();
      }
      if (this.documentPromise) {
        this.documentPromise.cancel();
      }
    }
  }, {
    key: 'onGetPdfRaw',
    value: function onGetPdfRaw(pdfRaw) {
      var _props = this.props,
          onContentAvailable = _props.onContentAvailable,
          onBinaryContentAvailable = _props.onBinaryContentAvailable,
          binaryToBase64 = _props.binaryToBase64;

      if (typeof onBinaryContentAvailable === 'function') {
        onBinaryContentAvailable(pdfRaw);
      }
      if (typeof onContentAvailable === 'function') {
        var convertBinaryToBase64 = this.defaultBinaryToBase64;
        if (typeof binaryToBase64 === 'function') {
          convertBinaryToBase64 = binaryToBase64;
        }
        onContentAvailable(convertBinaryToBase64(pdfRaw));
      }
    }
  }, {
    key: 'onDocumentComplete',
    value: function onDocumentComplete(pdf) {
      this.setState({ pdf: pdf });
      var _props2 = this.props,
          onDocumentComplete = _props2.onDocumentComplete,
          onContentAvailable = _props2.onContentAvailable,
          onBinaryContentAvailable = _props2.onBinaryContentAvailable;

      if (typeof onDocumentComplete === 'function') {
        onDocumentComplete(pdf.numPages);
      }
      if (typeof onContentAvailable === 'function' || typeof onBinaryContentAvailable === 'function') {
        pdf.getData().then(this.onGetPdfRaw);
      }
      pdf.getPage(this.props.page).then(this.onPageComplete);
    }
  }, {
    key: 'onPageComplete',
    value: function onPageComplete(page) {
      this.setState({ page: page });
      this.renderPdf();
      var onPageComplete = this.props.onPageComplete;

      if (typeof onPageComplete === 'function') {
        onPageComplete(page.pageIndex + 1);
      }
    }
  }, {
    key: 'getDocument',
    value: function getDocument(val) {
      if (this.documentPromise) {
        this.documentPromise.cancel();
      }
      this.documentPromise = makeCancelable(window.PDFJS.getDocument(val).promise);
      this.documentPromise.promise.then(this.onDocumentComplete).catch(this.onDocumentError);
      return this.documentPromise;
    }
  }, {
    key: 'loadByteArray',
    value: function loadByteArray(byteArray) {
      this.getDocument(byteArray);
    }
  }, {
    key: 'loadPDFDocument',
    value: function loadPDFDocument(props) {
      var _this2 = this;

      if (props.file) {
        if (typeof props.file === 'string') {
          return this.getDocument(props.file);
        }
        // Is a File object
        var reader = new FileReader();
        reader.onloadend = function () {
          return _this2.loadByteArray(new Uint8Array(reader.result));
        };
        reader.readAsArrayBuffer(props.file);
      } else if (props.binaryContent) {
        this.loadByteArray(props.binaryContent);
      } else if (props.content) {
        var bytes = window.atob(props.content);
        var byteLength = bytes.length;
        var byteArray = new Uint8Array(new ArrayBuffer(byteLength));
        for (var index = 0; index < byteLength; index += 1) {
          byteArray[index] = bytes.charCodeAt(index);
        }
        this.loadByteArray(byteArray);
      } else if (props.documentInitParameters) {
        return this.getDocument(props.documentInitParameters);
      } else {
        throw new Error('react-pdf-js works with a file(URL) or (base64)content. At least one needs to be provided!');
      }
    }
  }, {
    key: 'renderPdf',
    value: function renderPdf() {
      var page = this.state.page;

      if (page) {
        var canvas = this.canvas;

        var canvasContext = canvas.getContext('2d');
        var _props3 = this.props,
            scale = _props3.scale,
            rotate = _props3.rotate;

        var viewport = page.getViewport(scale, rotate);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: canvasContext, viewport: viewport });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var loading = this.props.loading;
      var page = this.state.page;

      return page ? _react2.default.createElement('canvas', {
        ref: function ref(c) {
          _this3.canvas = c;
        },
        className: this.props.className,
        style: this.props.style
      }) : loading || _react2.default.createElement(
        'div',
        null,
        'Loading PDF...'
      );
    }
  }]);
  return Pdf;
}(_react2.default.Component);

Pdf.propTypes = {
  content: _propTypes2.default.string,
  documentInitParameters: _propTypes2.default.shape({
    url: _propTypes2.default.string
  }),
  binaryContent: _propTypes2.default.shape({
    data: _propTypes2.default.any
  }),
  file: _propTypes2.default.any, // Could be File object or URL string.
  loading: _propTypes2.default.any,
  page: _propTypes2.default.number,
  scale: _propTypes2.default.number,
  rotate: _propTypes2.default.number,
  onContentAvailable: _propTypes2.default.func,
  onBinaryContentAvailable: _propTypes2.default.func,
  binaryToBase64: _propTypes2.default.func,
  onDocumentComplete: _propTypes2.default.func,
  onPageComplete: _propTypes2.default.func,
  className: _propTypes2.default.string,
  style: _propTypes2.default.object
};
Pdf.defaultProps = {
  page: 1,
  scale: 1.0
};


Pdf.displayName = 'react-pdf-js';

exports.default = Pdf;

function _inspect(input, depth) {
  var maxDepth = 4;
  var maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input === 'undefined' ? 'undefined' : (0, _typeof3.default)(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      var first = _inspect(input[0], depth);

      if (input.every(function (item) {
        return _inspect(item, depth) === first;
      })) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(function (item) {
          return _inspect(item, depth);
        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    var keys = (0, _keys2.default)(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    var indent = '  '.repeat(depth - 1);
    var entries = keys.slice(0, maxKeys).map(function (key) {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : (0, _stringify2.default)(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}