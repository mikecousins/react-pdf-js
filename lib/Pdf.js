'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

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

var calculateScale = function calculateScale(scale, fillWidth, fillHeight, view, parentElement) {
  if (fillWidth) {
    var pageWidth = view[2] - view[0];
    return parentElement.clientWidth / pageWidth;
  }
  if (fillHeight) {
    var pageHeight = view[3] - view[1];
    return parentElement.clientHeight / pageHeight;
  }
  return scale;
};

var Pdf = function (_React$Component) {
  (0, _inherits3.default)(Pdf, _React$Component);

  function Pdf() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Pdf);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Pdf.__proto__ || (0, _getPrototypeOf2.default)(Pdf)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.onGetPdfRaw = function (pdfRaw) {
      var _this$props = _this.props,
          onContentAvailable = _this$props.onContentAvailable,
          onBinaryContentAvailable = _this$props.onBinaryContentAvailable,
          binaryToBase64 = _this$props.binaryToBase64;

      if (typeof onBinaryContentAvailable === 'function') {
        onBinaryContentAvailable(pdfRaw);
      }
      if (typeof onContentAvailable === 'function') {
        var convertBinaryToBase64 = _this.defaultBinaryToBase64;
        if (typeof binaryToBase64 === 'function') {
          convertBinaryToBase64 = binaryToBase64;
        }
        onContentAvailable(convertBinaryToBase64(pdfRaw));
      }
    }, _this.onDocumentComplete = function (pdf) {
      _this.setState({ pdf: pdf });
      var _this$props2 = _this.props,
          onDocumentComplete = _this$props2.onDocumentComplete,
          onContentAvailable = _this$props2.onContentAvailable,
          onBinaryContentAvailable = _this$props2.onBinaryContentAvailable;

      if (typeof onDocumentComplete === 'function') {
        onDocumentComplete(pdf.numPages);
      }
      if (typeof onContentAvailable === 'function' || typeof onBinaryContentAvailable === 'function') {
        pdf.getData().then(_this.onGetPdfRaw);
      }
      pdf.getPage(_this.props.page).then(_this.onPageComplete);
    }, _this.onDocumentError = function (err) {
      if (err.isCanceled && err.pdf) {
        err.pdf.destroy();
      }
      if (typeof _this.props.onDocumentError === 'function') {
        _this.props.onDocumentError(err);
      }
    }, _this.onPageComplete = function (page) {
      _this.setState({ page: page });
      _this.renderPdf();
      var onPageComplete = _this.props.onPageComplete;

      if (typeof onPageComplete === 'function') {
        onPageComplete(page.pageIndex + 1);
      }
    }, _this.getDocument = function (val, withCredentials) {
      if (_this.documentPromise) {
        _this.documentPromise.cancel();
      }
      if (withCredentials) {
        _this.documentPromise = makeCancelable(window.PDFJS.getDocument({
          url: val,
          withCredentials: true
        }).promise);
      } else {
        _this.documentPromise = makeCancelable(window.PDFJS.getDocument(val).promise);
      }

      _this.documentPromise.promise.then(_this.onDocumentComplete).catch(_this.onDocumentError);
      return _this.documentPromise;
    }, _this.loadByteArray = function (byteArray) {
      _this.getDocument(byteArray);
    }, _this.loadPDFDocument = function (props) {
      if (props.file) {
        if (typeof props.file === 'string') {
          return _this.getDocument(props.file, props.withCredentials);
        }
        // Is a File object
        var reader = new FileReader();
        reader.onloadend = function () {
          return _this.loadByteArray(new Uint8Array(reader.result));
        };
        reader.readAsArrayBuffer(props.file);
      } else if (props.binaryContent) {
        _this.loadByteArray(props.binaryContent);
      } else if (props.content) {
        var bytes = window.atob(props.content);
        var byteLength = bytes.length;
        var byteArray = new Uint8Array(new ArrayBuffer(byteLength));
        for (var index = 0; index < byteLength; index += 1) {
          byteArray[index] = bytes.charCodeAt(index);
        }
        _this.loadByteArray(byteArray);
      } else if (props.documentInitParameters) {
        return _this.getDocument(props.documentInitParameters);
      } else {
        throw new Error('react-pdf-js works with a file(URL) or (base64)content. At least one needs to be provided!');
      }
    }, _this.renderPdf = function () {
      var page = _this.state.page;

      if (page) {
        var _this$props3 = _this.props,
            fillWidth = _this$props3.fillWidth,
            fillHeight = _this$props3.fillHeight,
            rotate = _this$props3.rotate,
            pScale = _this$props3.scale,
            className = _this$props3.className,
            style = _this$props3.style;

        // We need to create a new canvas every time in order to avoid concurrent rendering
        // in the same canvas, which can lead to distorted or upside-down views.

        var canvas = document.createElement('canvas');

        (0, _keys2.default)(style || {}).forEach(function (styleField) {
          canvas.style[styleField] = style[styleField];
        });
        canvas.className = className;

        // Replace or add the new canvas to the placehloder div set up in the render method.
        var parentElement = _this.canvasParent;
        var previousCanvas = parentElement.firstChild;
        if (previousCanvas) {
          parentElement.replaceChild(canvas, previousCanvas);
        } else {
          parentElement.appendChild(canvas);
        }

        var canvasContext = canvas.getContext('2d');
        var dpiScale = window.devicePixelRatio || 1;
        var scale = calculateScale(pScale, fillWidth, fillHeight, page.view, parentElement);
        var adjustedScale = scale * dpiScale;
        var viewport = page.getViewport(adjustedScale, rotate);
        canvas.style.width = viewport.width / dpiScale + 'px';
        canvas.style.height = viewport.height / dpiScale + 'px';
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: canvasContext, viewport: viewport });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Pdf, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadPDFDocument(this.props);
      this.renderPdf();

      // re-scale PDF when size or orientation of window changes
      window.addEventListener('resize', this.renderPdf);
      window.addEventListener('orientationchange', this.renderPdf);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var pdf = this.state.pdf;


      var newDocInit = newProps.documentInitParameters && newProps.documentInitParameters.url ? newProps.documentInitParameters.url : null;
      var docInit = this.props.documentInitParameters && this.props.documentInitParameters.url ? this.props.documentInitParameters.url : null;

      // Only reload if the most significant source has changed!
      var newSource = newProps.file;
      var oldSource = newSource ? this.props.file : null;
      newSource = newSource || newProps.binaryContent;
      oldSource = newSource && !oldSource ? this.props.binaryContent : oldSource;
      newSource = newSource || newProps.content;
      oldSource = newSource && !oldSource ? this.props.content : oldSource;
      newSource = newSource || newDocInit;
      oldSource = newSource && !oldSource ? docInit : oldSource;

      if (newSource && newSource !== oldSource && (newProps.file && newProps.file !== this.props.file || newProps.content && newProps.content !== this.props.content || newProps.binaryContent && newProps.binaryContent !== this.props.binaryContent || newDocInit && (0, _stringify2.default)(newDocInit) !== (0, _stringify2.default)(docInit))) {
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

      window.removeEventListener('resize', this.renderPdf);
      window.removeEventListener('orientationchange', this.renderPdf);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var loading = this.props.loading;
      var page = this.state.page;

      return page ? _react2.default.createElement('div', { ref: function ref(parentDiv) {
          _this2.canvasParent = parentDiv;
        } }) : loading || _react2.default.createElement(
        'div',
        null,
        'Loading PDF...'
      );
    }
  }], [{
    key: 'defaultBinaryToBase64',


    // Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
    // use window.btoa' step and without risking a blow of the stack. According to [Jon Leightons's]
    // tests, this appears to be a faster approach: http://jsperf.com/encoding-xhr-image-data/5
    // Jon Leighton https://gist.github.com/jonleighton/958841
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
        b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
        d = chunk & 63; // 63 = 2^6 - 1

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
  fillWidth: _propTypes2.default.bool, // stretch to fill width, has precedence over fillHeight
  fillHeight: _propTypes2.default.bool, // stretch to fill height
  rotate: _propTypes2.default.number,
  onContentAvailable: _propTypes2.default.func,
  onBinaryContentAvailable: _propTypes2.default.func,
  binaryToBase64: _propTypes2.default.func,
  onDocumentComplete: _propTypes2.default.func,
  onDocumentError: _propTypes2.default.func,
  onPageComplete: _propTypes2.default.func,
  className: _propTypes2.default.string,
  style: _propTypes2.default.object,
  withCredentials: _propTypes2.default.bool
};
Pdf.defaultProps = {
  page: 1,
  scale: 1.0,
  fillWidth: false,
  fillHeight: false,
  withCredentials: false
};


Pdf.displayName = 'react-pdf-js';

exports.default = Pdf;