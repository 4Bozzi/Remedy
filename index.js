import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/src/App';
import * as serviceWorker from './client/src/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
 
