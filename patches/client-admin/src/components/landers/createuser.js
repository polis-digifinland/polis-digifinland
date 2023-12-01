// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { doCreateUser, doFacebookSignin } from '../../actions'
import { Heading, Box, Text, Button, jsx } from 'theme-ui'

import { Link } from 'react-router-dom'
import StaticLayout from './lander-layout'
import strings from '../../strings/strings'

import { withTranslation } from 'react-i18next';

const fbAppId = process.env.FB_APP_ID

@connect((state) => state.signin)
class CreateuserTranslated extends React.Component {
  getDest() {
    return this.props.location.pathname.slice('/createuser'.length)
  }

  handleLoginClicked(e) {
    e.preventDefault()
    const attrs = {
      hname: this.hname.value,
      email: this.email.value,
      password: this.password.value,
      gatekeeperTosPrivacy: true
    }

    let dest = this.getDest()
    if (!dest.length) {
      dest = '/'
    }
    this.props.dispatch(doCreateUser(attrs, dest))
  }

  facebookButtonClicked() {
    let dest = this.getDest()
    if (!dest.length) {
      dest = '/'
    }
    this.props.dispatch(doFacebookSignin(dest))
  }

  handleFacebookPasswordSubmit() {
    let dest = this.getDest()
    if (!dest.length) {
      dest = '/'
    }
    const optionalPassword = this.facebook_password.value
    this.props.dispatch(doFacebookSignin(dest, optionalPassword))
  }

  maybeErrorMessage() {
    let markup = ''
    if (this.props.error) {
      markup = <div>{strings(this.props.error.responseText)}</div>
    }
    return markup
  }

  drawForm() {
    const { t } = this.props;
    return (
      <Box>
        <form sx={{ mb: [4] }}>
          <Box sx={{ my: [2] }}>
            <input
              sx={{
                fontFamily: 'body',
                fontSize: [2],
                width: '35em',
                borderRadius: 2,
                padding: [2],
                border: '1px solid',
                borderColor: 'mediumGray'
              }}
              id="createUserNameInput"
              ref={(c) => (this.hname = c)}
              placeholder={t('createuser.name')}
              type="text"
            />
          </Box>
          <Box sx={{ my: [2] }}>
            <input
              sx={{
                fontFamily: 'body',
                fontSize: [2],
                width: '35em',
                borderRadius: 2,
                padding: [2],
                border: '1px solid',
                borderColor: 'mediumGray'
              }}
              id="createUserEmailInput"
              ref={(c) => (this.email = c)}
              placeholder={t('createuser.email')}
              type="email"
            />
          </Box>
          <Box sx={{ my: [2] }}>
            <input
              sx={{
                fontFamily: 'body',
                fontSize: [2],
                width: '35em',
                borderRadius: 2,
                padding: [2],
                border: '1px solid',
                borderColor: 'mediumGray'
              }}
              id="createUserPasswordInput"
              ref={(c) => (this.password = c)}
              placeholder={t('createuser.password')}
              type="password"
            />
          </Box>
          <Box sx={{ my: [2] }}>
            <input
              sx={{
                fontFamily: 'body',
                fontSize: [2],
                width: '35em',
                borderRadius: 2,
                padding: [2],
                border: '1px solid',
                borderColor: 'mediumGray'
              }}
              id="createUserPasswordRepeatInput"
              ref={(c) => (this.password2 = c)}
              placeholder={t('createuser.password_repeat')}
              type="password"
            />
          </Box>
          {this.maybeErrorMessage()}

          <Box>
            {t('createuser.agree')}{' '}
            <a href="https://pol.is/tos" tabIndex="110">
              {t('createuser.agree_tos')}
            </a>{' '}
            {t('createuser.agree_and')}{' '}
            <a href="https://pol.is/privacy" tabIndex="111">
              {' '}
              {t('createuser.agree_privacy')}
            </a>
            .
          </Box>
          <Button
            sx={{ my: [2] }}
            id="createUserButton"
            onClick={this.handleLoginClicked.bind(this)}>
            {this.props.pending ? t('createuser.creating') : t('createuser.create')} 
          </Button>
        </form>
        <Box sx={{ mb: [4] }}>
          {t('createuser.already_have_account')}{' '}
          <Link
            tabIndex="6"
            to={'/signin' + this.getDest()}
            data-section="signup-select">
            {t('createuser.signin')}
          </Link>
        </Box>

        {fbAppId && (
          <>
            <Button
              sx={{ my: [2] }}
              id="signupFacebookButton"
              onClick={this.facebookButtonClicked.bind(this)}>
              Sign up with Facebook
            </Button>
            <Text>
              If you click &apos;Sign in with Facebook&apos; and are not a pol.is
              user, you will be registered and you agree to the pol.is terms and
              privacy policy
            </Text>
          </>
        )}
      </Box>
    )
  }

  drawPasswordConnectFacebookForm() {
    return (
      <Box>
        <Text>
          A pol.is user already exists with the email address associated with
          this Facebook account.
        </Text>
        <Text>
          {' '}
          Please enter the password to your pol.is account to enable Facebook
          login.
        </Text>
        <input
          ref={(c) => (this.facebook_password = c)}
          placeholder="polis password"
          type="password"
        />
        <Button onClick={this.handleFacebookPasswordSubmit.bind(this)}>
          {'Connect Facebook Account'}
        </Button>
      </Box>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <StaticLayout>
        <div>
          <Heading as="h1" sx={{ my: [4, null, 5], fontSize: [6, null, 7] }}>
            {t('createuser.title')}
          </Heading>
          {this.props.facebookError !== 'polis_err_user_with_this_email_exists'
            ? this.drawForm()
            : this.drawPasswordConnectFacebookForm()}
        </div>
      </StaticLayout>
    )
  }
}

// export default Createuser
const Createuser = withTranslation()(CreateuserTranslated);
export default withTranslation()(Createuser);
