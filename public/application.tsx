import * as React from 'react';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';

import MainTemplate from './teamplates/MainTemplate/MainTemplate';
import Home from "./views/Home/Home";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp/SignUp";
import Scoreboard from "./views/Scoreboard/Scoreboard";

import * as RoutesMap from './service/RoutesMap/RoutesMap';

import store from './store/Store';
import {setCurrentUser} from "./actions/User/User";

import './static/css/reset.scss';
import './static/css/fonts.scss';
import './static/css/main.scss';

if (localStorage.token) {
  store.dispatch(setCurrentUser(localStorage.token));
}

export const App = () => (
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path={ RoutesMap.HOME } component={ MainTemplate }>
        <IndexRoute component={ Home }/>
        <Route path={ RoutesMap.SIGNIN } component={ SignIn }/>
        <Route path={ RoutesMap.SIGNUP } component={ SignUp }/>
        <Route path={ RoutesMap.SCOREBOARD } component={ Scoreboard }/>
      </Route>
    </Router>
  </Provider>
);
