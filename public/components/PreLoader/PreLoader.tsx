import * as React from 'react';
import {connect} from 'react-redux';

import './PreLoader.scss';

interface Props {
  show: boolean;
}

class PreLoader extends React.Component<Props, void> {
  render() {
    const {show} = this.props;

    const style = {
      display: show ? 'block' : 'none'
    };

    return (
      <div
        className='pre-loader__wrapper'
        style={style}>
          <div className='pre-loader'>
            <div className='line square'/>
            <div className='line square2'/>
            <div className='line square3'/>
            <div className='line square4'/>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    show: state.preloader
  }
};

export default connect(mapStateToProps)(PreLoader);
