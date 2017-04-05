import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Root from './Root';

const mountNode = document.getElementById('root');

ReactDOM.render(<Root />, mountNode);

if (module.hot && typeof module.hot.accept === 'function') {
  module.hot.accept('./Root', () => {
    const NewRoot = require<any>('./Root').default;
    ReactDOM.render(<NewRoot />, mountNode);
  });
}
