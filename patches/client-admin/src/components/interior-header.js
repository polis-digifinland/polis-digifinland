/** @jsx jsx */
import React from 'react'
import { Box, jsx } from 'theme-ui'
import { Link } from 'react-router-dom'
import Logomark from './framework/logomark'

import { withTranslation } from 'react-i18next';

class InteriorHeaderTranslated extends React.Component {
  render() {
    const { t, i18n } = this.props;
    document.documentElement.lang = i18n.language; // This is too slow for google translate
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.lang = lng;
    };
    return (
      <Box>
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'primary',
            color: 'background',
            zIndex: 1000,
            py: [3],
            px: [4],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Link sx={{ variant: 'links.header' }} to="/">
            <Logomark
              style={{ marginRight: 10, position: 'relative', top: 6 }}
              fill={'white'}
            />
            Polis
          </Link>
          
          <Link id="signoutLink" sx={{ variant: 'links.header' }} to="/signout">
            {t('header.signout')}
          </Link>
          
        </Box>
        <div style={{display:"flex", justifyContent:"flex-end"}}>
            <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('fi')}>FI</button>
            <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('sv')}>SV</button>
            <button style={{margin: "10px"}} type="button" onClick={() => changeLanguage('en')}>EN</button>
          </div>
        <Box>{this.props.children}</Box>
      </Box>
    )
  }
}

// export default InteriorHeader
const InteriorHeader = withTranslation()(InteriorHeaderTranslated);
export default withTranslation()(InteriorHeader);

