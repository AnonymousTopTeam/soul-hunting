import * as React from 'react';

import {Form} from "../../components/Form/Form";
import {Background} from "../../components/Background/Background";

import './SignUp.scss';

const signUpFields = [{
  title: 'Login',
  name: 'login',
  type: 'text',
  description: 'Enter username',
  placeholder: 'Username'
}, {
  title: 'Email',
  name: 'email',
  type: 'email',
  description: 'Enter email',
  placeholder: 'Email address'
}, {
  title: 'Password',
  name: 'password1',
  type: 'password',
  description: 'Enter password',
  placeholder: '••••••••'
}, {
  title: 'Repeat password',
  name: 'password2',
  type: 'password',
  description: 'Enter password',
  placeholder: '••••••••'
}];

export class SignUp extends React.Component<void, void> {
  render() {
    return (
      <div className='wrapper__registration'>
        <Background />
        <div className='registration'>
          <Form fields={signUpFields} control='Sign Up'/>
        </div>
      </div>
    );
  }
}