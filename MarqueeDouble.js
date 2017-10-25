import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const defaultPropsFunc = (funcName) => {
    return () => {
        if (window.location.host.indexOf('localhost') > -1) {
            console.info(funcName + ' is not defined');
        }
    }
}

const propTypes = {
    loop: React.PropTypes.bool,
    space: React.PropTypes.number,
    step: React.PropTypes.number,
    onStart: React.PropTypes.func,
    onBounce: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    interval: React.PropTypes.number,
    direction: React.PropTypes.string,
    delay: React.PropTypes.number,
    autoStart: React.PropTypes.bool
};
const defaultProps = {
    loop: true,
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
class MarqueeDouble extends Component {
    constructor(props) {
        super(props);
        this.mover;
        this.delayer;
        this.widths = {
            singleWidth: undefined,
            containerWidth: undefined,
            moverWidth: undefined
        };
        this.state = {
            left: 0,
            right: 0,
            singleWidth: -1,
            moverWidth: -1,
            containerWidth: -1,
            viewPortWidth: -1,
            isMove: this.props.autoStart
        };
        this.moveTo = {
            left: () => {
                this.setState({left: 0});
            },
            right: () => {
                this.setState({
                    right: this.state.containerWidth - this.state.viewPortWidth
                });
            }
        }
        this.direction = {
            left: () => {
                this.setState({
                    left: this.state.left - this.props.step
                })
                // this.moverDivNode.style.transform = `translateX(${this.state.left}px)`;
            },
            right: () => {
                this.setState({
                    right: this.state.right - this.props.step
                });
                // this.moverDivNode.style.transform = `translateX(${this.state.right}px)`;
            }
        }
        this.move = this.move.bind(this);
        this.delay = this.delay.bind(this);
    }
    start() {
        const {isMove} = this.state;
        if (!isMove) {
            this.mover = setInterval(this.move, this.props.interval);
            this.setState({isMove: true})
        }
    }
    stop() {
        clearInterval(this.mover);
        this.setState({isMove: false})
    }
    delay() {

        const {delay} = this.props;
        this.stop();
        this.delayer = setTimeout(() => {
            this.start();
        }, delay);
    }
    move() {
        const {
            left,
            right,
            singleWidth,
            moverWidth,
            containerWidth,
            viewPortWidth
        } = this.state;
        const {
            step,
            onStart,
            onEnd,
            double,
            direction,
            space,
            delay
        } = this.props;
        // 이벤트 발생
        if ((direction == 'left' && left == 0) || (direction == 'right' && right == containerWidth - viewPortWidth)) {
            onStart();
        }
        if ((direction == 'left' && left <= - moverWidth / 2) || (direction == 'right' && right < (moverWidth - (singleWidth + viewPortWidth)))) {
            this.moveTo[direction]();
            return;
        }
        this.direction[direction]();
    }
    componentDidMount() {
        const {interval, direction, autoStart, delay} = this.props;
        ReactDOM.findDOMNode(this.single).style.display = "inline-block";
        this.singleNode = ReactDOM.findDOMNode(this.single);
        this.moverDivNode = ReactDOM.findDOMNode(this.moverDiv);
        this.containerNode = ReactDOM.findDOMNode(this.container);

        const singleWidth = this.singleNode.offsetWidth;

        this.moverDivNode.style.width = `${singleWidth * 2}px`;
        this.containerNode.style.width = `${singleWidth * 2}px`;

        const moverWidth = this.moverDivNode.offsetWidth;
        const containerWidth = this.containerNode.offsetWidth;
        const viewPortWidth = window.innerWidth || document.body.clientWidth;

        this.setState({singleWidth: singleWidth, moverWidth: moverWidth, containerWidth: containerWidth, viewPortWidth: viewPortWidth});
        if (direction == 'right') {
            this.moverDivNode.style.right = `${containerWidth - viewPortWidth}px`;
            this.setState({
                right: containerWidth - viewPortWidth
            })
        }
        if (autoStart) {
            if (delay > 0) {
                this.delay();
            } else {
                this.mover = setInterval(this.move, interval);
            }
        }
    }
    componentWillUnmount() {
        clearInterval(this.mover);
        clearTimeout(this.delayer);
    }
    render() {
        const {space, direction} = this.props;
        const {left} = this.state;
        const style = {
            paddingRight: direction == 'left'
                ? `${space}px`
                : 0,
            paddingLeft: direction == 'right'
                ? `${space}px`
                : 0
        }
        const marqueeStyle = {
            transform: `translateX(${left}px)`
        }
        const single = (
            <span className="Marquee-Child-Single" style={style} ref= {(ref => {this.single = ref})}>{this.props.children}</span>
        );
        return (
            <div className={this.props.className ? 'MarqueeC-Div ' + this.props.className : 'MarqueeC-Div'} ref={(ref) => {
                this.container = ref
            }}>
                <div className="Marquee-Mover" style={marqueeStyle} ref={(ref) => {
                    this.moverDiv = ref
                }}>
                    <table className="Marquee-Table">
                        <tbody>
                            <tr>
                                <td style={{padding: 0}}>
                                    {single}
                                </td>
                                <td style={{padding: 0}}>
                                    {single}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

MarqueeDouble.propTypes = propTypes;
MarqueeDouble.defaultProps = defaultProps;
export default MarqueeDouble;
