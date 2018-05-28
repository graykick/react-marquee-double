'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./App.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultPropsFunc = function defaultPropsFunc(funcName) {
    return function () {
        if (window.location.host.indexOf('localhost') > -1) {
            console.info(funcName + ' is not defined');
        }
    };
};

var propTypes = {
    loop: _propTypes2.default.number,
    space: _propTypes2.default.number,
    step: _propTypes2.default.number,
    onStart: _propTypes2.default.func,
    onBounce: _propTypes2.default.func,
    onEnd: _propTypes2.default.func,
    interval: _propTypes2.default.number,
    direction: _propTypes2.default.string,
    delay: _propTypes2.default.number,
    autoStart: _propTypes2.default.bool
};
var defaultProps = {
    loop: -1,
    space: 100,
    step: 6,
    onStart: defaultPropsFunc('onStart'),
    onBounce: defaultPropsFunc('onBounce'),
    onEnd: defaultPropsFunc('onEnd'),
    interval: 33,
    direction: 'left',
    delay: 3200,
    autoStart: false
};

var MarqueeDouble = function (_Component) {
    _inherits(MarqueeDouble, _Component);

    function MarqueeDouble(props) {
        _classCallCheck(this, MarqueeDouble);

        var _this = _possibleConstructorReturn(this, (MarqueeDouble.__proto__ || Object.getPrototypeOf(MarqueeDouble)).call(this, props));

        _this.mover;
        _this.delayer;
        _this.widths = {
            singleWidth: undefined,
            containerWidth: undefined,
            moverWidth: undefined
        };
        _this.state = {
            left: 0,
            right: 0,
            singleWidth: -1,
            moverWidth: -1,
            containerWidth: -1,
            viewPortWidth: -1,
            isMove: _this.props.autoStart,
            loop: _this.props.loop
        };
        _this.moveTo = {
            left: function left() {
                _this.setState({ left: 0 });
            },
            right: function right() {
                _this.setState({
                    right: _this.state.containerWidth - _this.state.viewPortWidth
                });
            }
        };
        _this.direction = {
            left: function left() {
                _this.setState({
                    left: _this.state.left - _this.props.step
                });
                // this.moverDivNode.style.transform = `translateX(${this.state.left}px)`;
            },
            right: function right() {
                _this.setState({
                    right: _this.state.right - _this.props.step
                });
                // this.moverDivNode.style.transform = `translateX(${this.state.right}px)`;
            }
        };
        _this.move = _this.move.bind(_this);
        _this.delay = _this.delay.bind(_this);
        return _this;
    }

    _createClass(MarqueeDouble, [{
        key: 'start',
        value: function start() {
            var isMove = this.state.isMove;

            if (!isMove) {
                this.mover = setInterval(this.move, this.props.interval);
                this.setState({ isMove: true });
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            clearInterval(this.mover);
            this.setState({ isMove: false });
        }
    }, {
        key: 'delay',
        value: function delay() {
            var _this2 = this;

            var delay = this.props.delay;

            this.stop();
            this.delayer = setTimeout(function () {
                _this2.start();
            }, delay);
        }
    }, {
        key: 'move',
        value: function move() {
            var _state = this.state,
                left = _state.left,
                right = _state.right,
                singleWidth = _state.singleWidth,
                moverWidth = _state.moverWidth,
                containerWidth = _state.containerWidth,
                viewPortWidth = _state.viewPortWidth;
            var _props = this.props,
                step = _props.step,
                onStart = _props.onStart,
                onEnd = _props.onEnd,
                double = _props.double,
                direction = _props.direction,
                space = _props.space,
                delay = _props.delay;
            // 이벤트 발생

            if (direction == 'left' && left == 0 || direction == 'right' && right == containerWidth - viewPortWidth) {
                if (this.state.loop !== -1 && this.state.loop <= 0) {
                    this.stop();
                    return;
                }
                this.setState({
                    loop: --this.state.loop
                });
                onStart();
            }
            if (direction == 'left' && left <= -moverWidth / 2 || direction == 'right' && right < moverWidth - (singleWidth + viewPortWidth)) {

                this.moveTo[direction]();
                return;
            }
            this.direction[direction]();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _props2 = this.props,
                interval = _props2.interval,
                direction = _props2.direction,
                autoStart = _props2.autoStart,
                delay = _props2.delay;

            _reactDom2.default.findDOMNode(this.single).style.display = "inline-block";
            this.singleNode = _reactDom2.default.findDOMNode(this.single);
            this.moverDivNode = _reactDom2.default.findDOMNode(this.moverDiv);
            this.containerNode = _reactDom2.default.findDOMNode(this.container);

            var singleWidth = this.singleNode.offsetWidth;

            this.moverDivNode.style.width = singleWidth * 2 + 'px';
            this.containerNode.style.width = singleWidth * 2 + 'px';

            var moverWidth = this.moverDivNode.offsetWidth;
            var containerWidth = this.containerNode.offsetWidth;
            var viewPortWidth = window.innerWidth || document.body.clientWidth;

            this.setState({ singleWidth: singleWidth, moverWidth: moverWidth, containerWidth: containerWidth, viewPortWidth: viewPortWidth });
            if (direction == 'right') {
                this.moverDivNode.style.right = containerWidth - viewPortWidth + 'px';
                this.setState({
                    right: containerWidth - viewPortWidth
                });
            }
            if (autoStart) {
                if (delay > 0) {
                    this.delay();
                } else {
                    this.mover = setInterval(this.move, interval);
                }
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.mover);
            clearTimeout(this.delayer);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props3 = this.props,
                space = _props3.space,
                direction = _props3.direction;
            var left = this.state.left;

            var style = {
                paddingRight: direction == 'left' ? space + 'px' : 0,
                paddingLeft: direction == 'right' ? space + 'px' : 0
            };
            var marqueeStyle = {
                transform: 'translateX(' + left + 'px)'
            };
            var single = _react2.default.createElement(
                'span',
                { className: 'Marquee-Child-Single', style: style, ref: function ref(_ref) {
                        _this3.single = _ref;
                    } },
                this.props.children
            );
            return _react2.default.createElement(
                'div',
                { className: this.props.className ? 'MarqueeC-Div ' + this.props.className : 'MarqueeC-Div', ref: function ref(_ref3) {
                        _this3.container = _ref3;
                    } },
                _react2.default.createElement(
                    'div',
                    { className: 'Marquee-Mover', style: marqueeStyle, ref: function ref(_ref2) {
                            _this3.moverDiv = _ref2;
                        } },
                    _react2.default.createElement(
                        'table',
                        { className: 'Marquee-Table' },
                        _react2.default.createElement(
                            'tbody',
                            null,
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    { style: { padding: 0 } },
                                    single
                                ),
                                _react2.default.createElement(
                                    'td',
                                    { style: { padding: 0 } },
                                    single
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return MarqueeDouble;
}(_react.Component);

MarqueeDouble.propTypes = propTypes;
MarqueeDouble.defaultProps = defaultProps;
exports.default = MarqueeDouble;
