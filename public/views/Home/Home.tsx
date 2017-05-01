import * as React from 'react';
import {connect} from "react-redux";
import {Link, browserHistory} from 'react-router';
import {Button} from "../../components/Button/Button";
import transport from '../../service/Transport/Transoprt';

import {NEXT_BUTTON} from '../../constants/Buttons/Buttons';
import {LOGIN_REQUEST, LOGIN_FAIL, LOGIN_SUCCESS} from "../../constants/User/User";

import './Home.scss';

const auth = localStorage.token;

const urls = auth ? [
  '/game',
  '/top',
  '/asdasd'
] : [
  '/signin',
  '/signup'
];

// Error test:
// click enter -> esc -> don't work

class Home extends React.Component<void, void> {
  constructor() {
    super();

    this.setKeysButtons(auth ? 3 : 2);
  }

  logout() {
    transport.post('/logout');
  }

  test() {
    transport.post('/signin', JSON.stringify({
      'username': 'vladoss',
      'password': 'qqqqqqqq'
    }))
      .then(response => {
        if (+response.status) {
          return response.json();
        } else {
          console.log('here');
        }
      })
      .then(data => {
        console.log('data:');
        console.log(data);
        transport.get('/cur-user')
          .then(data => {
            return data.json();
          })
          .then(data => {
            console.log('op:');
            console.log(data);
          });
      });
  }

  setKeysButtons(max) {
    document.addEventListener('keydown', event => {
      let current = +this.props.current;

      switch (event.keyCode) {
        case 13:
          browserHistory.push(urls[--current]);
          break;
        case 38:
          if (current === 1) {
            this.setActiveButton(max);
          } else {
            this.setActiveButton(--current);
          }
          break;
        case 40:
          if (current === max) {
            this.setActiveButton(1);
          } else {
            this.setActiveButton(++current);
          }
          break;
        default:
          break;
      }
    });
  }

  setActiveButton(number) {
    switch (+number) {
      case 1:
        this.props.setActive(true, false, false, number);
        break;
      case 2:
        this.props.setActive(false, true, false, number);
        break;
      case 3:
        this.props.setActive(false, false, true, number);
        break;
      default:
        break;
    }
  }

  render() {
    const { isAuthenticated } = this.props;
    const buttons = this._setButtons(isAuthenticated);

    const buttonsRender = buttons.map((item, index) => {
      return (
        <Link to={ item.url } key={ index }>
          <Button
            text={ item.text }
            isActive={ item.isActive }
            mouseOver={ this.setActiveButton.bind(this, item.number) }
          />
        </Link>
      );
    });

    return (
      <div className="wrapper__form">
        <div className="wrapper__main__form">
          <div className='main__form'>
            { buttonsRender }
          </div>
        </div>
      </div>
    );
  }

  _setButtons(auth) {
    return auth ? [
      {
        number: 1,
        text: 'GAME',
        url: '/signin',
        isActive: this.props.button1
      },
      {
        number: 2,
        text: 'MAP',
        url: '/signup',
        isActive: this.props.button2
      },
      {
        number: 3,
        text: 'MAP2',
        url: '/signup',
        isActive: this.props.button3
      }
    ] : [
      {
        number: 1,
        text: 'SIGN IN',
        url: '/signin',
        isActive: this.props.button1
      },
      {
        number: 2,
        text: 'REGISTER',
        url: '/signup',
        isActive: this.props.button2
      }
    ];
  }
}

export default connect(
  state => ({
    isAuthenticated: state.authentication.isAuthenticated,
    current: state.buttons[0].current,
    button1: state.buttons[1].button,
    button2: state.buttons[2].button,
    button3: state.buttons[3].button,
  }),

  dispatch => ({
    setActive: (button1, button2, button3, current) => {
      dispatch({
        type: NEXT_BUTTON,
        payload: [
          {
            current
          },
          {
            button: button1
          },
          {
            button: button2
          },
          {
            button: button3
          }
        ]
      })
    }
  })
)(Home);
