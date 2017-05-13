import * as React from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';

import {SINGLEPLAYER} from '../../constants/Game/Game';
import {Mobile} from '../Mobile/Mobile';
import {Background} from '../../components/Background/Background';
import GameTable from '../../components/GameTable/GameTable';
import {Instructions} from '../../components/Instructions/Instructions';
import {Time} from '../../components/Time/Time';
import {Aim} from '../../components/Aim/Aim';
import {Health} from '../../components/Health/Health';
import {GameShadow} from '../../components/GameShadow/GameShadow';
import {Weapon} from '../../components/Weapon/Weapon';
import {EndGameTheme} from '../../components/EndGameTheme/EndGameTheme';
import {Hurt} from '../../components/Hurt/Hurt';
import {StartGameTheme} from '../../components/StartGameTheme/StartGameTheme';
import {GameMenu} from '../../components/GameMenu/GameMenu';

import musicService from '../../service/MusicService/MusicService';
import GameManager from '../../game/Manager/GameManager/GameManager.js';

import './SinglePlayer.scss';

const header = [{
  title: '#'
}, {
  title: 'Username'
}, {
  title: 'Score'
}];

interface Props {
  isAuthenticated: boolean;
  device: boolean;
  user?: string;
}

class SinglePlayer extends React.Component<Props, any> {
  _users: Array<Array<string>>;

  constructor(props: Props) {
    super(props);

    this._users = [
      [this.props.user, '0'],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', '']
    ];
  }

  componentWillMount() {
    if (!this.props.isAuthenticated || !this._isAdmin()) {
      browserHistory.push('/');
    } else {
      setTimeout(() => {
        musicService.stopBackground();
      }, 300);
    }
  }

  componentDidMount() {
    if (this._isAdmin()) {
      new GameManager(SINGLEPLAYER, browserHistory.push.bind(this, '/game'));
    }
  }

  render() {
    const {device} = this.props;

    return (
      <div>
        { device ?
          <div>
            <Instructions />
            <div className='wrapper__game'>
              <Time />
              <Aim />
              <Health />
              <GameShadow />
              <Weapon />
              <div className='gameTable__wrapper'>
                <div className='gameTable__wrapper__table'>
                  <GameTable header={ header } content={ this._users }/>
                </div>
              </div>

              <Hurt />
              <EndGameTheme />
              <StartGameTheme />
            </div>
            <GameMenu />
          </div>
          :
          <div className='wrapper__mobile'>
            <Background closed={ false }/>
            <Mobile />
          </div>
        }
      </div>
    );
  }

  _isAdmin() {
    return this.props.user === 'vladoss';
  }
}

const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    user: state.authentication.user,
    device: state.device,
  }
};

export default connect(mapStateToProps)(SinglePlayer as any);
