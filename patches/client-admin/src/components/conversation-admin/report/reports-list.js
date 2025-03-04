// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import PolisNet from '../../../util/net'
import React from 'react'
import PropTypes from 'prop-types'
import Url from '../../../util/url'
import { connect } from 'react-redux'
import { Heading, Box, Button } from 'theme-ui'
import { populateZidMetadataStore } from '../../../actions'
import ComponentHelpers from '../../../util/component-helpers'
import NoPermission from '../no-permission'

import { withTranslation } from 'react-i18next';

@connect((state) => state.zid_metadata)
class ReportsListTranslated extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      reports: []
    }
  }

  getData() {
    const { match } = this.props
    const reportsPromise = PolisNet.polisGet('/api/v3/reports', {
      conversation_id: match.params.conversation_id
    })
    reportsPromise.then((reports) => {
      this.setState({
        loading: false,
        reports: reports
      })
    })
  }

  componentDidMount() {
    const { zid_metadata } = this.props

    this.props.dispatch(
      populateZidMetadataStore(this.props.match.params.conversation_id)
    )

    // If we already have is_mod, get the data
    if (zid_metadata?.is_mod) {
      this.getData()
    }
  }

  componentDidUpdate(prevProps) {
    // Only call getData() if is_mod changed from false/undefined to true
    const { zid_metadata } = this.props
    const prevIsMod = prevProps.zid_metadata?.is_mod
    const currentIsMod = zid_metadata?.is_mod

    if (!prevIsMod && currentIsMod) {
      this.getData()
    }
  }

  createReportClicked() {
    const { match } = this.props
    PolisNet.polisPost('/api/v3/reports', {
      conversation_id: match.params.conversation_id
    }).then(() => {
      this.getData()
    })
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }
    
    const { t } = this.props;

    if (this.state.loading) {
      return <div>{t('reports.loading')}</div>
    }
    return (
      <Box>
        <Heading
          as="h3"
          sx={{
            fontSize: [3, null, 4],
            lineHeight: 'body',
            mb: [3, null, 4]
          }}>
          {t('reports.title')}
        </Heading>
        <Box sx={{ mb: [3, null, 4] }}>
          <Button onClick={this.createReportClicked.bind(this)}>
            {t('reports.create_new')}
          </Button>
        </Box>
        {this.state.reports.map((report) => {
          return (
            <Box sx={{ mb: [2] }} key={report.report_id} data-test-id="report-list-item">
              <a
                target="_blank"
                rel="noreferrer"
                href={Url.urlPrefix + 'report/' + report.report_id}>
                {Url.urlPrefix}report/{report.report_id}
              </a>
            </Box>
          )
        })}
      </Box>
    )
  }
}

ReportsListTranslated.propTypes = {
  t: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      conversation_id: PropTypes.string
    })
  }),
  zid_metadata: PropTypes.shape({
    is_mod: PropTypes.bool
  })
}

const ReportsList = withTranslation()(ReportsListTranslated);
export default ReportsList
