// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import ConversationHasCommentsCheck from './conversation-has-comments-check'
import React from 'react'
import PropTypes from 'prop-types'
import Url from '../../util/url'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heading } from 'theme-ui'
import ComponentHelpers from '../../util/component-helpers'
import NoPermission from './no-permission'

import { withTranslation } from 'react-i18next';

@connect((state) => state.zid_metadata)
class ShareAndEmbedTranslated extends React.Component {
  constructEmbeddedOnMarkup() {
    return (
      <p data-test-id="embed-page">
        {'Embedded on: '}
        <a
          style={{ color: 'black' }}
          target="blank"
          href={this.props.zid_metadata.parent_url}>
          {this.props.zid_metadata.parent_url}
        </a>
      </p>
    )
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }
    
    const { t } = this.props;

    const { match } = this.props
    return (
      <div>
        <Heading
          as="h3"
          sx={{
            fontSize: [3, null, 4],
            lineHeight: 'body',
            mb: [3, null, 4]
          }}>
          {t('distribute.title')}
        </Heading>
        <ConversationHasCommentsCheck
          conversation_id={match.params.conversation_id}
          strict_moderation={this.props.zid_metadata.strict_moderation}
        />
        <div>
          <p>{t('distribute.share')}</p>
          <p>
            <a
              target="blank"
              href={Url.urlPrefix + match.params.conversation_id}>
              {Url.urlPrefix + match.params.conversation_id}
            </a>
          </p>
        </div>
        <div>
          <p>{t('distribute.embed')}</p>
          <div>
            <pre>
              {'<div'}
              {" class='polis'"}
              {" data-conversation_id='" + match.params.conversation_id + "'>"}
              {'</div>\n'}
              {"<script async src='" + Url.urlPrefix + "embed.js'></script>"}
            </pre>
          </div>
          <p>
            
            {t('distribute.desc')}{' '}
            <Link to="/integrate">
              {t('distribute.link')}
            </Link>
          </p>
          <div>
            {this.props.zid_metadata.parent_url
              ? this.constructEmbeddedOnMarkup()
              : ''}
          </div>
        </div>
      </div>
    )
  }
}

ShareAndEmbedTranslated.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      conversation_id: PropTypes.string
    })
  }),
  t: PropTypes.func.isRequired,
  zid_metadata: PropTypes.shape({
    parent_url: PropTypes.string,
    strict_moderation: PropTypes.bool
  })
}

// export default ShareAndEmbed
const ShareAndEmbed = withTranslation()(ShareAndEmbedTranslated);
export default withTranslation()(ShareAndEmbed);
