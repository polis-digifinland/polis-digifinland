// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import StaticLayout from './lander-layout'
import { Heading } from 'theme-ui'

import { doSignout } from '../../actions'

import { withTranslation } from 'react-i18next';

@connect((state) => state.signout)
class SignOutTranslated extends React.Component {
  componentDidMount() {
    this.props.dispatch(doSignout('/signin')) // DF customization, due to WAF restrictions redirect back to /signin instead of /home
  }

  render() {
    const { t } = this.props;
    return (
      <StaticLayout>
        <Heading as="h1" sx={{ my: [4, null, 5], fontSize: [6, null, 7] }}>
          {t('signout.signingout')}
        </Heading>
      </StaticLayout>
    )
  }
}

SignOutTranslated.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func.isRequired
}

// export default SignOut
const SignOut = withTranslation()(SignOutTranslated);
export default withTranslation()(SignOut);
