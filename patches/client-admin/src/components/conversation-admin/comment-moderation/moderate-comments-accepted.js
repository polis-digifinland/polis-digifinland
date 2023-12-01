// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  changeCommentStatusToRejected,
  changeCommentCommentIsMeta
} from '../../../actions'
import Comment from './comment'

import { withTranslation } from 'react-i18next';

@connect((state) => state.mod_comments_accepted)
class ModerateCommentsAcceptedTranslated extends React.Component {
  onCommentRejected(comment) {
    this.props.dispatch(changeCommentStatusToRejected(comment))
  }

  toggleIsMetaHandler(comment, is_meta) {
    this.props.dispatch(changeCommentCommentIsMeta(comment, is_meta))
  }

  createCommentMarkup() {
    const comments = this.props.accepted_comments.map((comment, i) => {
      const { t } = this.props;
      return (
        <Comment
          key={i}
          rejectButton
          rejectClickHandler={this.onCommentRejected.bind(this)}
          rejectButtonText={t('moderate.reject')}
          isMetaCheckbox
          toggleIsMetaHandler={this.toggleIsMetaHandler.bind(this)}
          comment={comment}
        />
      )
    })
    return comments
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        {this.props.accepted_comments !== null
          ? this.createCommentMarkup()
          : t('moderate.loading_accepted')}
      </div>
    )
  }
}

ModerateCommentsAcceptedTranslated.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func.isRequired,
  accepted_comments: PropTypes.arrayOf(PropTypes.object)
}

// export default ModerateCommentsAccepted
const ModerateCommentsAccepted = withTranslation()(ModerateCommentsAcceptedTranslated);
export default withTranslation()(ModerateCommentsAccepted);
