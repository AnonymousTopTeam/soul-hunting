import * as React from 'react';

import './Button.scss';

interface Props {
  text?: string;
  isActive?: boolean;
  onClick?: () => void;
  type?: string;
}

export class Button extends React.Component<Props, void> {
  constructor(props: Props =
                {
                  text: 'text',
                  isActive: true,
                  onClick: null,
                  type: 'button'
                }) {
    super(props);
  }

  render() {
    return (
      <div className='main__form-button'>
        <div
          className={`main__form-button__background
          ${this.props.isActive ? 'start__background' : ''}`}>
          <p
            className={`main__form-button__text
            ${this.props.isActive ? 'start__button' : ''}`}>
            {this.props.text}
          </p>
        </div>
      </div>
    );
  }
}
