function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import './index.less';

var Swiper = /*#__PURE__*/function (_Component) {
  _inherits(Swiper, _Component);

  var _super = _createSuper(Swiper);

  function Swiper(props) {
    var _this;

    _classCallCheck(this, Swiper);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "touchStart", function (e) {
      _this.startX = e.touches[0].pageX;
      _this.startY = e.touches[0].pageY;
    });

    _defineProperty(_assertThisInitialized(_this), "dealColTranslate", function (r) {
      var translate = _this.state.translate;
      var onTouchEnd = _this.props.onTouchEnd;
      if (r === 'Down' && !translate) return;
      var l = Math.abs(_this.startY - _this.endY);

      if (r === 'Up') {
        var v = (l / _this.line).toFixed(1) * 1 + translate;
        v = v >= 1 ? 0.9 : v;

        _this.setState({
          translate: v
        });
      } else {
        var _v = translate - l / _this.line;

        _v = _v < 0 ? 0 : _v.toFixed(1) * 1;

        _this.setState({
          translate: _v
        }, function () {
          onTouchEnd && onTouchEnd();
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "dealRowTranslate", function (r) {
      var translate = _this.state.translate;
      var onTouchEnd = _this.props.onTouchEnd;
      console.log(r);

      if (r === 'Left' || r === 'Right') {
        if (r === 'Left' && !translate) return;
        var l = Math.abs(_this.startX - _this.endX);

        if (r === 'Right') {
          var v = (l / _this.line).toFixed(1) * 1 + translate;
          v = v >= 1 ? 0.9 : v;

          _this.setState({
            translate: v
          });
        } else {
          var _v2 = translate - l / _this.line;

          _v2 = _v2 < 0 ? 0 : _v2.toFixed(1) * 1;

          _this.setState({
            translate: _v2
          }, function () {
            onTouchEnd && onTouchEnd();
          });
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onEnd", function (e) {
      var _this$props$direction = _this.props.direction,
          direction = _this$props$direction === void 0 ? 'row' : _this$props$direction;
      _this.endX = e.changedTouches[0].pageX;
      _this.endY = e.changedTouches[0].pageY;

      var r = _this.swipeDirection(_this.startX, _this.endX, _this.startY, _this.endY);

      if (direction === 'row') {
        // if(r === 'Left' || r === 'Right') {
        //     if(r === 'Left' && !translate) return
        //     let l = Math.abs(this.startX - this.endX);
        //     if(r === 'Right')  {
        //         let v = (l/this.line).toFixed(1)*1+translate
        //         v = v >= 1 ? 0.9 : v;
        //         console.log(v)
        //         this.setState({
        //             translate: v,
        //         })
        //     }else {
        //         let v = translate - l/this.line
        //         v  =  v < 0  ?  0 : v.toFixed(1)*1
        //         this.setState({
        //             translate: v,
        //         }, () =>{
        //             onTouchEnd && onTouchEnd()
        //         })
        //     }
        // }
        return _this.dealRowTranslate(r);
      }

      _this.dealColTranslate(r);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragEnter", function (e) {
      console.log(e, 'handleDragEnter');
      e.preventDefault(); // e.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragLeave", function (e) {
      console.log(e, 'handleDragLeave');
      e.preventDefault(); // e.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragOver", function (e) {
      e.preventDefault(); // e.stopPropagation();

      console.log(e, 'handleDragOver');
    });

    _defineProperty(_assertThisInitialized(_this), "handleDrop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(e, 'handleDrop');
    });

    _defineProperty(_assertThisInitialized(_this), "renderLine", function () {
      var translate = _this.state.translate;
      var _this$props$direction2 = _this.props.direction,
          direction = _this$props$direction2 === void 0 ? 'row' : _this$props$direction2;
      var isCol = direction === 'col';
      var s = {
        transform: isCol ? "translate(-50%, -".concat(translate * _this.line, "px)") : "translate(".concat(translate * _this.line, "px, -50%)")
      };

      if (isCol) {
        return /*#__PURE__*/React.createElement("div", {
          className: "drag-line col",
          onTouchStart: _this.touchStart,
          onTouchEnd: _this.onEnd
        }, /*#__PURE__*/React.createElement("div", {
          className: "line-color line-col",
          style: {
            height: "".concat(translate * _this.line + 5, "px")
          }
        }), /*#__PURE__*/React.createElement("div", {
          className: "bag bag-col",
          style: s
        }));
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "drag-line",
        onTouchStart: _this.touchStart,
        onTouchEnd: _this.onEnd
      }, /*#__PURE__*/React.createElement("div", {
        className: "line-color",
        style: {
          width: "".concat(translate * _this.line + 5, "px")
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "bag bag-row",
        style: s
      }));
    });

    _this.state = {
      translate: 0
    };
    _this.line = 100;
    return _this;
  }

  _createClass(Swiper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.line = 100;
    }
  }, {
    key: "swipeDirection",
    value: function swipeDirection(x1, x2, y1, y2) {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderLine();
    }
  }]);

  return Swiper;
}(Component);

export default Swiper;