import * as React from 'react';
import {Link, browserHistory} from 'react-router'
import {connect} from "react-redux";
import {Field, reduxForm} from 'redux-form';

import {FormDescription} from "./FormDescription/FormDescription";
import {FormHeader} from "./FormHeader/FormHeader";
import {FormError} from "./FormError/FormError";
import {FormInput} from "./FormInput/FormInput";
import {FormLabel} from "./FormLabel/FormLabel";
import {FormContent} from "./FormContent/FormContent";
import FormButton from "./FormButton/FormButton";
import validate from "../../service/Validators/index";

import './Form.scss';
import transport from "../../service/Transport/Transoprt";

interface Props {
  fields?: Array<any>;
  error?: string;
  control: string;
  submit: any;
  type?: string;
}

class Form extends React.Component<Props, void> {
  _errors: any;

  constructor(props: Props) {
    super(props);

    this._errors = {};
  }

  submit() {
    if (this._isValid(this._errors)) {
      const fields = this._getFields();
      const isSignIn = fields.length === 2;

      const data = isSignIn ?
        this._signInPack(fields) :
        this._signUpPack(fields);

      console.log(data);
      data = JSON.stringify(data);

      isSignIn ? this._send('/signin', data)
        : this._send('/signup', data);
    }
  }

  _send(url, data) {
    console.log(data);

    return this.props.send(url, data)
      .then(response => {
        if (+response.status === 200) {
          localStorage.setItem('token', data);
          this.props.setCurrentUser(data);
          browserHistory.push('/');
        }
      });
  }

  render() {
    const {handleSubmit, fields, error, control} = this.props;

    const content = fields.map((item, index) => {
      return (
        <div key={ index }>
          <Field
            name={ item.name }
            names={ item.name }
            type={ item.type }
            component={ this._renderField() }
            label={ item.title }
            description={ item.description }
            placeholder={ item.placeholder }
          />
        </div>
      )
    });

    return (
      <div className="form__wrapper-elements">
        <div className="wrapper__form-center">
          <FormHeader />
          <form
            className="form"
            name="form"
            ref={ (form) => {
              this.form = form
            }}
            onSubmit={handleSubmit}
          >
            <FormError text={ error }/>
            <FormContent content={ content }/>
            <FormButton text={ control } click={ this.submit.bind(this) }/>
          </form>
        </div>
      </div>
    );
  }

  _isValid(errors) {
    for (let error in errors) {
      if (errors[error]) {
        return false;
      }
    }

    return true;
  }

  _renderField() {
    return ({
              input, label, type,
              description, placeholder, names,
              meta: {
                asyncValidating,
                touched,
                error
              }
            },) => (
      <li className={ touched && error && 'error' }>
        { this._setError(names, error) }
        <FormLabel title={ label }/>
        <FormInput
          name={ names }
          type={ type }
          input={ ...input }
          placeholder={ placeholder }
        />
        <FormDescription
          touched={ touched }
          description={ description }
          error={ error }
        />
      </li>
    );
  }

  _setError(name, error) {
    this._errors[name] = error;
  }

  _getFields() {
    return this.form.querySelectorAll('input');
  }

  _signInPack(data) {
    return {
      'username': data[0].value,
      'password': data[1].value
    };
  }

  _signUpPack(data) {
    return {
      'login': data[0].value,
      'email': data[1].value,
      'password': data[2].value
    };
  }
}

const ReduxForm = reduxForm({
  form: 'form',
  validate,
  onSubmit: () => {
  }
})(Form);

export default connect(
  null,
  dispatch => ({
    send: (url, data) => {
      return transport.post(url, data);
    },

    setCurrentUser: user => {
      dispatch({
        type: 'SET_CURRENT_USER',
        user
      })
    }
  })
)(ReduxForm);
