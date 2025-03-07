// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, jsx } from 'theme-ui'
import { populateZidMetadataStore, resetMetadataStore } from '../../actions'
import { Switch, Route, Link } from 'react-router-dom'

import ConversationConfig from './conversation-config'
import ConversationStats from './stats'

import ModerateComments from './comment-moderation/'

// import DataExport from "./data-export";
import ShareAndEmbed from './share-and-embed'

import Reports from './report/reports'

import { withTranslation } from 'react-i18next';

@connect((state) => state.zid_metadata)
class ConversationAdminContainerTranslated extends React.Component {
  loadZidMetadata() {
    this.props.dispatch(
      populateZidMetadataStore(this.props.match.params.conversation_id)
    )
  }

  resetMetadata() {
    this.props.dispatch(resetMetadataStore())
  }

  componentWillMount() {
    this.loadZidMetadata()
  }

  componentWillUnmount() {
    this.resetMetadata()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.conversation_id !== this.props.match.params.conversation_id) {
      this.loadZidMetadata()
    }
  }

  render() {
    const { match, location } = this.props

    const url = location.pathname.split('/')[3]
    
    const { t } = this.props;

    return (
      <Flex>
        <Box sx={{ mr: [5], p: [4], flex: '0 0 275' }}>
          <Box sx={{ mb: [3] }}>
            <Link sx={{ variant: 'links.nav' }} to={`/`}>
              {t('conv_nav.all')}
            </Link>
          </Box>
          <Box sx={{ mb: [3] }}>
            <Link
              sx={{ variant: url ? 'links.nav' : 'links.activeNav' }}
              to={`${match.url}`}>
              {t('conv_nav.configure')}
            </Link>
          </Box>
          <Box sx={{ mb: [3] }}>
            <Link
              sx={{
                variant: url === 'share' ? 'links.activeNav' : 'links.nav'
              }}
              to={`${match.url}/share`}>
              {t('conv_nav.distribute')}
            </Link>
          </Box>
          <Box sx={{ mb: [3] }}>
            <Link
              sx={{
                variant: url === 'comments' ? 'links.activeNav' : 'links.nav'
              }}
              data-test-id="moderate-comments"
              to={`${match.url}/comments`}>
              {t('conv_nav.moderate')}
            </Link>
          </Box>
          <Box sx={{ mb: [3] }}>
            <Link
              sx={{
                variant: url === 'stats' ? 'links.activeNav' : 'links.nav'
              }}
              to={`${match.url}/stats`}>
              {t('conv_nav.monitor')}
            </Link>
          </Box>
          <Box sx={{ mb: [3] }}>
            <Link
              sx={{
                variant: url === 'reports' ? 'links.activeNav' : 'links.nav'
              }}
              to={`${match.url}/reports`}>
              {t('conv_nav.report')}
            </Link>
          </Box>
        </Box>
        <Box sx={{ p: [4], flex: '0 0 auto', maxWidth: '35em', mx: [4] }}>
          <Switch>
            <Route
              exact
              path={`${match.path}/`}
              component={ConversationConfig}
            />
            <Route
              exact
              path={`${match.path}/share`}
              component={ShareAndEmbed}
            />
            <Route exact path={`${match.path}/reports`} component={Reports} />
            <Route
              path={`${match.path}/comments`}
              component={ModerateComments}
            />
            <Route
              exact
              path={`${match.path}/stats`}
              component={ConversationStats}
            />
            {/* <Route exact path={`${match.path}/export`} component={DataExport} /> */}
          </Switch>
        </Box>
      </Flex>
    )
  }
}

const ConversationAdminContainer = withTranslation()(ConversationAdminContainerTranslated);
export default ConversationAdminContainer
