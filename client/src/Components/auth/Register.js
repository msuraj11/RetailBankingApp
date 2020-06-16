import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import {isEmpty} from 'lodash';

const Register = (props) => {
    const [formData, setFormData] = useState({
        fields:{
            name:'',
            email: '',
            mobileNumber: '',
            password: '',
            confirmPassword: ''
        },
        isErrorMessageOnMobNumb: false,
        isPasswordMatch: true,
        isEmailError: false
    });

    const {fields, isErrorMessageOnMobNumb, isPasswordMatch, isEmailError} = formData;
    const {name, email, mobileNumber, password, confirmPassword} = fields;

    const onFieldChange = e => {
        setFormData({...formData, fields: {...fields, [e.target.name]: e.target.value}});    
    };

    const onBlurFields = e => {
        if (!isEmpty(confirmPassword) && password !== confirmPassword) {
            setFormData({...formData, isPasswordMatch: false});
        } else {
            setFormData({...formData, isPasswordMatch: true});
        }
        if (e.target.name === 'mobileNumber') {
            const mobNum = `+91${e.target.value}`
            const mobRegX = /^((\+){1}91){1}[1-9]{1}[0-9]{9}$/;
            setFormData({...formData, isErrorMessageOnMobNumb: !mobRegX.test(mobNum)});            
        }
        if (e.target.name === 'email') {
            const emailRegX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
            setFormData({...formData, isEmailError: !emailRegX.test(email)});
        }
    };

    const onSubmitForm = e => {
        e.preventDefault();
        console.log(formData);
        props.history.push('/tokenVerifier');
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmitForm(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                    />
                    {isEmailError &&
                        <small className="form-danger">
                            Invalid E-Mail format.
                        </small>
                    }
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile image, use a
                        Gravatar email
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        minLength="10"
                        value={mobileNumber}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                    />
                    {isErrorMessageOnMobNumb &&
                        <small className="form-danger">
                            Mobile number entered is not valid.
                        </small>
                    }
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                        minLength="6"
                    />
                    {!isEmpty(password) && !isEmpty(confirmPassword) && !isPasswordMatch &&
                        <small className="form-danger">
                            Passwords didnot match.
                        </small>
                    }
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                        minLength="6"
                    />
                    {!isEmpty(password) && !isEmpty(confirmPassword) && !isPasswordMatch &&
                        <small className="form-danger">
                            Passwords didnot match.
                        </small>
                    }
                </div>
                <button
                    type="submit"
                    className='btn btn-primary'
                    disabled={!isPasswordMatch || isErrorMessageOnMobNumb || isEmailError ||
                        isEmpty(name) || isEmpty(email) || isEmpty(mobileNumber) ||
                        isEmpty(password) || isEmpty(confirmPassword) || password.length < 6 ||
                        confirmPassword.length < 6 }
                >
                    Register
                </button>
            </form>
            <p className="my-1">
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </Fragment>
    );
};

export default Register;