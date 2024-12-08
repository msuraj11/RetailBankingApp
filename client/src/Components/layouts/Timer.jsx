import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Timer extends Component {
  state = {
    minutes: 5,
    seconds: 0
  };

  componentDidMount() {
    if (this.props.startTimer) {
      this.myInterval = setInterval(() => {
        const {seconds, minutes} = this.state;

        if (seconds > 0) {
          this.setState(({seconds}) => ({
            seconds: seconds - 1
          }));
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(this.myInterval);
          } else {
            this.setState(({minutes}) => ({
              minutes: minutes - 1,
              seconds: 59
            }));
          }
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  render() {
    const {minutes, seconds} = this.state;
    const {startTimer} = this.props;
    return (
      <React.Fragment>
        <div className="form">
          {startTimer ? (
            <h3 className="form-danger">
              Token expires in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </h3>
          ) : (
            <h3 className="form-danger">Token Expired!</h3>
          )}
        </div>
      </React.Fragment>
    );
  }
}

Timer.propTypes = {
  startTimer: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  startTimer: state.auth.startTimer
});

export default connect(mapStateToProps)(Timer);
