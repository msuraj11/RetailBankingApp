import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Timer = ({startTimer}) => {
  const [time, setTime] = useState({
    minutes: 5,
    seconds: 0
  });

  const {seconds, minutes} = time;

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (seconds > 0) {
        setTime((prevState) => ({
          ...prevState,
          seconds: prevState.seconds - 1
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timeInterval);
        } else {
          setTime((prevState) => ({
            minutes: prevState.minutes - 1,
            seconds: 59
          }));
        }
      }
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [startTimer, seconds, minutes]);

  return (
    <div className="form">
      {startTimer ? (
        <h3 className="form-danger">
          Token expires in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h3>
      ) : (
        <h3 className="form-danger">Token Expired!</h3>
      )}
    </div>
  );
};

Timer.propTypes = {
  startTimer: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  startTimer: state.auth.startTimer
});

export default connect(mapStateToProps)(Timer);
