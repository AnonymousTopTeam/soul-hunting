import * as React from 'react';

import './Button.scss';

interface Props {
  text?: string;
  isActive?: boolean;
  click?: () => void;
}

export class Button extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { isActive, text, click } = this.props;

    return (
      <div
        className='main__form-button'
        onClick={ click }
      >
        <div
          className={`main__form-button__background
          ${isActive ? 'start__background' : ''}`}>
          <p
            className={`main__form-button__text
            ${isActive ? 'start__button' : ''}`}>
            { text }
          </p>
        </div>
      </div>
    );
  }
}
