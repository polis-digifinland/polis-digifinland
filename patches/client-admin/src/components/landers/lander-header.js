/** @jsx jsx */
import { Component } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, jsx } from 'theme-ui'

import { Link } from 'react-router-dom'
import Logomark from '../framework/logomark'

import { withTranslation } from 'react-i18next';

class HeaderTranslated extends Component {
  render() {
    const { t, i18n } = this.props;
    document.documentElement.lang = i18n.language; // This is too slow for google translate
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.lang = lng;
    };
    return (
      <Box>
        <Flex
          sx={{
            margin: `0 auto`,
            width: '100%',
            paddingTop: '2rem',
            paddingBottom: '1.45rem',
            justifyContent: 'space-between'
          }}>
          <Box sx={{ zIndex: 1000 }}>
            <Link sx={{ variant: 'links.nav' }} to="/home">
              <Logomark
                style={{ marginRight: 10, position: 'relative', top: 6 }}
                fill={'#03a9f4'}
              />
              Polis
            </Link>
          </Box>
          <div>
          <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('fi')}>FI</button>
          <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('sv')}>SV</button>
          <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('en')}>EN</button>
          </div>
          <Box>
            <Link sx={{ variant: 'links.nav' }} to="/signin">
              {t('header.signin')}
            </Link>
          </Box>
        </Flex>
      </Box>
    )
  }
}

HeaderTranslated.propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.func.isRequired
}

// export default Header
const Header = withTranslation()(HeaderTranslated);
export default withTranslation()(Header);
