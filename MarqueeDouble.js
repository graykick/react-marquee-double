import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

const defaultPropsFunc = (funcName) => {
    return () => {
        console.warn(`${funcName} is not defined`);
    }
}

const MarqueeC_Div = {
    position: 'relative',
    textAlign: 'center'
};

const Marquee_Mover = {
    position: 'relative',
    boxSizing: 'padding - box',
    textAlign: 'center'
};

const Marquee_Child_Single = {
    whiteSpace: 'nowrap',
    display: 'inline-block'
};

const Marquee_Table = {
    margin: '0 auto',
    borderSpacing: '0'
};

const Marquee_Table_td = {
    margin: '0',
    padding: '0'
}

const Marquee_content = {
    whiteSpace: 'nowrap',
    display: 'inline-block'
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
    delay: 2000,
    autoStart: false
};

class MarqueeDouble extends Component {
    constructor(props) {
        super(props);
        this.mover;
        this.widths = {
            singleWidth: undefined,
            containerWidth: undefined,
            moverWidth: undefined
        };

        this.state = {
            left: -1,
            right: -1,
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
                this.moverDivNode.style.left = `${this.state.left}px`;
            },
            right: () => {
                this.setState({
                    right: this.state.right - this.props.step
                });
                this.moverDivNode.style.right = `${this.state.right}px`;
            }
        }

        this.move = this.move.bind(this);
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
        setTimeout(() => {
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
            console.log("on start");
        }

        if ((direction == 'left' && left < -moverWidth / 2) || (direction == 'right' && right < (moverWidth - (singleWidth + viewPortWidth)))) {
            console.log("in if");
            console.log(left)
            this.moveTo[direction]();
            return;
        }

        this.direction[direction]();
    }

    componentDidMount() {
        console.log("did monut");

        const {interval, direction, autoStart, delay} = this.props;

        ReactDOM.findDOMNode(this.single).style.display = "inline-block";
        this.singleNode = ReactDOM.findDOMNode(this.single);
        this.moverDivNode = ReactDOM.findDOMNode(this.moverDiv);
        this.containerNode = ReactDOM.findDOMNode(this.container);

        const singleWidth = this.singleNode.offsetWidth;
        console.log("single width = " + singleWidth);

        this.moverDivNode.style.width = `${singleWidth * 2}px`;
        this.containerNode.style.width = `${singleWidth * 2}px`;

        const moverWidth = this.moverDivNode.offsetWidth;
        const containerWidth = this.containerNode.offsetWidth;
        console.log("container width = " + moverWidth);

        const viewPortWidth = window.innerWidth || document.body.clientWidth;
        this.setState({singleWidth: singleWidth, moverWidth: moverWidth, containerWidth: containerWidth, viewPortWidth: viewPortWidth});
        console.log(viewPortWidth + ", " + singleWidth + ", " + moverWidth);
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
    }

    render() {
        const {space, direction} = this.props;
        const style = {
            paddingRight: direction == 'left'
                ? `${space}px`
                : 0,
            paddingLeft: direction == 'right'
                ? `${space}px`
                : 0
        }

        const single = ( < span className = "Marquee-Child-Single" style = {
            style
        }
        ref = {
            (ref => {
                this.single = ref
            })
        } > {
            this.props.children
        } < /span>
        );
        return ( <
            div className = "MarqueeC-Div" style={MarqueeC_Div}
            ref = {
                (ref) => {
                    this.container = ref
                }
            } >
            <
            div className = "Marquee-Mover" style={Marquee_Mover}
            ref = {
                (ref) => {
                    this.moverDiv = ref
                }
            } >
            <
            table className = "Marquee-Table" style={Marquee_Table}>
            <
            tr >
            <
            td style={Marquee_Table_td}> {
                single
            } <
            /td > < td style={Marquee_Table_td}> {
            single
        } < /td> < /tr > < /table> < /div > < /div>
        );
    }
}
MarqueeDouble.propTypes = propTypes;
MarqueeDouble.defaultProps = defaultProps;
export default MarqueeDouble;
