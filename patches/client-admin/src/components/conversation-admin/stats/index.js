// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
/** @jsx jsx */

import dateSetupUtil from '../../../util/data-export-date-setup'
import React from 'react'
import { connect } from 'react-redux'
import { populateConversationStatsStore, populateZidMetadataStore } from '../../../actions'
import NumberCards from './conversation-stats-number-cards'
import Voters from './voters'
import Commenters from './commenters'
import { Heading, Box, jsx } from 'theme-ui'
import ComponentHelpers from '../../../util/component-helpers'
import NoPermission from '../no-permission'

import { withTranslation } from 'react-i18next';

@connect((state) => state.stats)
@connect((state) => state.zid_metadata)
@connect((state) => state.stats)
class ConversationStatsTranslated extends React.Component {
  constructor(props) {
    super(props)
    const times = dateSetupUtil()
    this.chartSize = 500
    this.chartMargins = { top: 20, right: 20, bottom: 50, left: 70 }
    this.state = Object.assign({}, times)
  }

  handleUntilButtonClicked() {
    const year = this.refs.exportSelectYear.value
    const month = this.refs.exportSelectMonth.value
    const dayOfMonth = this.refs.exportSelectDay.value
    const tz = this.refs.exportSelectHour.value
    const dateString = [month, dayOfMonth, year, tz].join(' ')
    const dddate = new Date(dateString)
    const until = Number(dddate)
    this.setState(
      {
        until: until
      },
      function () {
        this.loadStats()
      }
    )
  }

  loadStats() {
    const { match } = this.props

    const until = this.state.until
    this.props.dispatch(
      populateConversationStatsStore(match.params.conversation_id, until)
    )
  }

  componentDidMount() {
    const { zid_metadata, match } = this.props

    this.props.dispatch(
      populateZidMetadataStore(match.params.conversation_id)
    )

    if (zid_metadata?.is_mod) {
      this.startPolling()
    }
  }

  componentDidUpdate(prevProps) {
    const { zid_metadata } = this.props
    const prevIsMod = prevProps.zid_metadata?.is_mod
    const currentIsMod = zid_metadata?.is_mod

    // Start polling only when is_mod changes from false to true
    if (!prevIsMod && currentIsMod) {
      this.startPolling()
    }
  }

  componentWillUnmount() {
    if (this.getStatsRepeatedly) {
      clearInterval(this.getStatsRepeatedly)
    }
  }

  startPolling() {
    // Clear any existing interval
    if (this.getStatsRepeatedly) {
      clearInterval(this.getStatsRepeatedly)
    }

    // Initial load
    this.loadStats()

    // Start polling
    this.getStatsRepeatedly = setInterval(() => {
      this.loadStats()
    }, 10000)
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }

    const { conversation_stats } = this.props
    const loading =
      !conversation_stats.firstCommentTimes ||
      !conversation_stats.firstVoteTimes

    const { t } = this.props;
    
    if (loading) return <Box>{t('stats.loading')}</Box>

    return (
      <div>
        <Heading
          as="h3"
          sx={{
            fontSize: [3, null, 4],
            lineHeight: 'body',
            mb: [3, null, 4]
          }}>
          {t('stats.title')}
        </Heading>
        <NumberCards data={conversation_stats} />
        <Voters
          firstVoteTimes={conversation_stats.firstVoteTimes}
          size={this.chartSize}
          margin={this.chartMargins}
        />
        <Commenters
          firstCommentTimes={conversation_stats.firstCommentTimes}
          size={this.chartSize}
          margin={this.chartMargins}
        />
      </div>
    )
  }
}

const ConversationStats = withTranslation()(ConversationStatsTranslated);
export default ConversationStats
