// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import $ from 'jquery'

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store'
import { ThemeProvider } from 'theme-ui'
import theme from './theme'
import App from './app'

import { BrowserRouter as Router, Route } from 'react-router-dom'

// import i18n (needs to be bundled ;)) 
import './i18n';

const store = configureStore()

class Root extends React.Component {
  render() {
    return (
    <Suspense fallback="loading">
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Route render={(routeProps) => <App {...routeProps} />}></Route>
          </Router>
        </Provider>
      </ThemeProvider>
      </Suspense>
    )
  }
}

window.$ = $

ReactDOM.render(<Root />, document.getElementById('root'))
