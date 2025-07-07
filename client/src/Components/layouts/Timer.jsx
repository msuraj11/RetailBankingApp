import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Timer = ({startTimer}) => {
  const [time, setTime] = useState({
    minutes: 2,
    seconds: 0
  });

  useEffect(() => {
  if (!startTimer) return;

  const timeInterval = setInterval(() => {
    setTime((prevState) => {
      const { seconds, minutes } = prevState;

      if (seconds > 0) {
        return { minutes, seconds: seconds - 1 };
      }

      if (minutes === 0) {
        clearInterval(timeInterval);
        return { minutes: 0, seconds: 0 };
      }

      return { minutes: minutes - 1, seconds: 59 };
    });
  }, 1000);

  return () => clearInterval(timeInterval);
}, [startTimer]);

  const {seconds, minutes} = time;

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
