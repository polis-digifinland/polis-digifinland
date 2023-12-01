// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Box, Heading, Text } from 'theme-ui'
import Url from '../../util/url'

import { withTranslation } from 'react-i18next';

@connect((state) => state.user)
class IntegrateTranslated extends React.Component {
  render() {
    const userSiteId = this.props.user === null
     ? '__loading, try refreshing__'
     : this.props.user.site_ids[0];
     
    const { t } = this.props;

    return (
      <Box>
        <Box>
          <Heading
            as="h3"
            sx={{
              fontSize: [3, null, 4],
              lineHeight: 'body',
              mb: [3, null, 4]
            }}>
            {t('integrate.title')}
          </Heading>
          <Text>
          {t('integrate.text1')}
          </Text>
          <ul>
            <li>{t('integrate.text2')}</li>
            <li>{t('integrate.text3')}</li>
            <li>{t('integrate.text4')}</li>
          </ul>
          <Box sx={{bg:'#BBB'}}>
            <pre>
              {`
<div
  class="polis"
  data-page_id="PAGE_ID"
  data-site_id="${userSiteId}">
</div>
<script async src="${Url.urlPrefix}embed.js"></script>
              `}
            </pre>
          </Box>
        </Box>
      </Box>
    )
  }
}

IntegrateTranslated.propTypes = {
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({
    site_ids: PropTypes.arrayOf(PropTypes.string)
  })
}

// export default Integrate
const Integrate = withTranslation()(IntegrateTranslated);
export default withTranslation()(Integrate);