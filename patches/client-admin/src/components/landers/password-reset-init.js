// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { doPasswordResetInit } from '../../actions'

import StaticLayout from './lander-layout'

import { withTranslation } from 'react-i18next';

@connect()
class PasswordResetInitTranslated extends React.Component {
  handleClick(e) {
    e.preventDefault()

    const attrs = {
      email: this.email.value
    }

    this.props.dispatch(doPasswordResetInit(attrs))
  }

  render() {
    const { t } = this.props;
    return (
      <StaticLayout>
        <h1>{t('password.title')}</h1>
        <form style={{marginBottom: "50px"}}>
          <input
            ref={(c) => (this.email = c)}
            placeholder={t('password.email')}
            type="text"
          />
          <button onClick={this.handleClick.bind(this)}>
            {t('password.send_email')}
          </button>
        </form>
      </StaticLayout>
    )
  }
}

PasswordResetInitTranslated.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func.isRequired
}

// export default PasswordResetInit
const PasswordResetInit = withTranslation()(PasswordResetInitTranslated);
export default withTranslation()(PasswordResetInit);
