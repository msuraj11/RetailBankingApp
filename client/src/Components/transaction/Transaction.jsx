import React, {useState} from 'react';
import {isEmpty, isNumber} from 'lodash';
import {connect} from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {getAccountInfo} from '../../actions/accountInfo';

const Transaction = ({setAlert, getAccountInfo}) => {
  const [txState, setTx] = useState({
    txAmount: '',
    txType: '',
    txBy: '',
    isValidAmount: true
  });

  const {txAmount, txBy, txType, isValidAmount} = txState;

  const onFieldChange = (e) => {
    setTx({
      ...txState,
      [e.target.name]: e.target.name === 'txAmount' ? Number(e.target.value) : e.target.value
    });
  };

  const onBlurField = (e) => {
    const isNumberTxAble = e.target.value < 100000 && e.target.value > 0;
    setTx({
      ...txState,
      isValidAmount: !isEmpty(e.target.value) && isNumberTxAble
    });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      await axios.post('/api/transactions', {txAmount, txType, txBy}, config);
      setAlert(`Your account is ${txType} with amount: ${txAmount} Rupees`, 'success');
      setTx({txAmount: '', txBy: '', txType: '', isValidAmount: true});
      getAccountInfo();
    } catch (err) {
      console.error(err.response.data);
      const errors = err.response.data.errors || [{msg: 'Something went wrong! Please try again later'}];
      if (errors) {
        errors.forEach((error) => setAlert(error.msg, 'danger', 10000));
      }
    }
  };

  return (
    <React.Fragment>
      <h1 className="large text-primary">Transaction</h1>
      <p className="lead">
        <i className="fas fa-coins"></i> Perform Credit/Debit transactions
      </p>
      <form className="form" onSubmit={(e) => onSubmitForm(e)}>
        <div className="form-group">
          <input
            type="number"
            placeholder="* Amount in INR"
            name="txAmount"
            value={txAmount}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurField(e)}
          />
          {!isValidAmount && (
            <small className="form-danger">
              Invalid INR format or Amount cannot be 0 more than 1,00,000 <i className="fas fa-rupee-sign"></i>.
            </small>
          )}
        </div>
        <div className="form-group">
          <select name="txType" value={txType} onChange={(e) => onFieldChange(e)}>
            <option value="">* --Select Transaction-type--</option>
            <option value="Credited">Credited</option>
            <option value="Debited">Debited</option>
          </select>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Transaction comment" name="txBy" value={txBy} onChange={(e) => onFieldChange(e)} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isValidAmount || !isNumber(txAmount) || isEmpty(txType) || isEmpty(txBy)}>
          Submit
        </button>
      </form>
    </React.Fragment>
  );
};

Transaction.propTypes = {
  setAlert: PropTypes.func,
  getAccountInfo: PropTypes.func
};

export default connect(null, {setAlert, getAccountInfo})(Transaction);
