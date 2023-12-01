// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { handleSeedCommentSubmit, seedCommentChanged } from '../../actions'
import strings from '../../strings/strings'
import { Box, Text, Button, jsx, Link } from 'theme-ui'

import { withTranslation } from 'react-i18next';

@connect((state) => state.seed_comments)
class ModerateCommentsSeedTranslated extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showErrorDialogue: false,
      showSuccessDialogue: false
    }
  }

  handleSubmitSeed() {
    const comment = {
      txt: this.seed_form.value,
      pid: 'mypid',
      conversation_id: this.props.params.conversation_id,
      // vote: 0,
      is_seed: true
    }
    this.props.dispatch(handleSeedCommentSubmit(comment))
  }

  handleTextareaChange(e) {
    this.props.dispatch(seedCommentChanged(e.target.value))
  }

  getButtonText() {
    const { t } = this.props;
    let text = t('seed.submit')

    if (this.props.success) {
      text = t('seed.success')
    }

    if (this.props.loading) {
      text = t('seed.saving')
    }

    return text
  }

  render() {
    const { t } = this.props;
    const { seedText } = this.props
    return (
      <Box sx={{ mb: [4] }}>
        <Text sx={{ mb: [2] }}>
          {t('seed.add')}{' '}
          <Link target="_blank" href="https://compdemocracy.org/seed-comments">
            {t('seed.comments')}
          </Link>{' '}
          {t('seed.to_vote_on')}
        </Text>
        <Box sx={{ mb: [2] }}>
          <textarea
            sx={{
              fontFamily: 'body',
              fontSize: [2],
              width: '35em',
              height: '7em',
              resize: 'none',
              padding: [2],
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'mediumGray'
            }}
            onChange={this.handleTextareaChange.bind(this)}
            maxLength="400"
            data-test-id="seed_form"
            value={seedText}
            ref={(c) => (this.seed_form = c)}
          />
        </Box>
        <Box>
          <Button onClick={this.handleSubmitSeed.bind(this)}>
            {this.getButtonText()}
          </Button>
          {this.props.error ? <Text>{strings(this.props.error)}</Text> : null}
        </Box>
      </Box>
    )
  }
}

// export default ModerateCommentsSeed
const ModerateCommentsSeed = withTranslation()(ModerateCommentsSeedTranslated);
export default withTranslation()(ModerateCommentsSeed);

// value={this.props.seedText}
