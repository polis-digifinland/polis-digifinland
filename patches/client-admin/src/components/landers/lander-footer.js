/** @jsx jsx */
import { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Link, jsx } from 'theme-ui'

import { withTranslation } from 'react-i18next';

class FooterTranslated extends Component {

    componentDidMount() {
        document.documentElement.style.backgroundColor = "#003d6d"; // Change HTML-elements background color to fit the footer color
    }

  render() {
    const { t } = this.props;
    return (
    <footer sx={{ position: 'absolute', left: '0'}}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', backgroundColor: '#003d6d', color: '#fff', fontSize: '0.875rem', position: 'relative', bottom: '0', py: '20px' }}>
        <Box sx={{ width: '30%', minWidth: '300px', display: 'flex', flexDirection: 'column', ml: '4'}}>
            <h3>{t('footer.whatis')}</h3>
            <p>{t('footer.desc')}</p>
        </Box>
        <Box sx={{ width: '30%', minWidth: '300px', display: 'flex',flexDirection: 'column', alignItems: 'center'}}>
            <ul sx={{ display: 'flex',flexDirection: 'column', listStyle: 'none',}}>
                <li sx={{ m: '10px'}}><Link target="_blank" sx={{ color: '#FFF', border: 0 }} href="https://digifinland.fi/tietosuoja/">{t('footer.links.privacy')} 🡥</Link></li>
                <li sx={{ m: '10px'}}><Link target="_blank" sx={{ color: '#FFF', border: 0 }} href="https://digifinland.fi/toimintamme/polis-kansalaiskeskustelualusta/">{t('footer.links.info')} 🡥</Link></li>
                <li sx={{ m: '10px'}}><Link target="_blank" sx={{ color: '#FFF', border: 0 }} href="https://compdemocracy.org/Welcome/">The Computational Democracy Project 🡥</Link></li>
                <li sx={{ m: '10px'}}><Link target="_blank" sx={{ color: '#FFF', border: 0 }} href="https://github.com/compdemocracy/polis">{t('footer.links.source')} 🡥</Link></li>
            </ul>
        </Box>
        <Box sx={{ width: '30%', minWidth: '300px', display: 'flex', flexDirection: 'column'}}>
            <ul sx={{ display: 'flex',flexDirection: 'column', listStyle: 'none',}}>
                <li><h3 sx={{ m: 0}}>{t('footer.provider')}</h3></li>
                <li><p sx={{ m: 0}}>DigiFinland Oy</p></li>
                <li><p sx={{ m: 0}}>Kuntatalo, Toinen linja 14</p></li>
                <li><p sx={{ m: 0}}>00180 Helsinki</p></li>
            </ul>
        </Box>
      </Box>
    </footer>
    )
  }
}

FooterTranslated.propTypes = {
  t: PropTypes.func.isRequired
}

// export default Footer
const Footer = withTranslation()(FooterTranslated);
export default withTranslation()(Footer);

