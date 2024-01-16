// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  changeCommentStatusToAccepted,
  changeCommentStatusToRejected,
  changeCommentCommentIsMeta
} from '../../../actions'
import Comment from './comment'

import { withTranslation } from 'react-i18next';

@connect((state) => state.mod_comments_unmoderated)
class ModerateCommentsTodoTranslated extends React.Component {
  onCommentAccepted(comment) {
    this.props.dispatch(changeCommentStatusToAccepted(comment))
  }

  onCommentRejected(comment) {
    this.props.dispatch(changeCommentStatusToRejected(comment))
  }

  toggleIsMetaHandler(comment, is_meta) {
    this.props.dispatch(changeCommentCommentIsMeta(comment, is_meta))
  }

  createCommentMarkup(max) {

    return this.props.unmoderated_comments.slice(0,max).map((comment, i) => {
      const { t } = this.props;
      return (
        <Comment
          key={i}
          acceptButton
          rejectButton
          acceptClickHandler={this.onCommentAccepted.bind(this)}
          rejectClickHandler={this.onCommentRejected.bind(this)}
          acceptButtonText={t('moderate.accept')}
          rejectButtonText={t('moderate.reject')}
          isMetaCheckbox
          toggleIsMetaHandler={this.toggleIsMetaHandler.bind(this)}
          comment={comment}
        />
      )
    })
    
  }

  render() {
    const { t } = this.props;
    const max = 500;
    return (
      <div>
        <div>
          {t('moderate.display_max', { param1: max})}
          {this.props.unmoderated_comments !== null
            ? this.createCommentMarkup(max)
            : t('moderate.loading_unmoderated')}
        </div>
      </div>
    )
  }
}

ModerateCommentsTodoTranslated.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func.isRequired,
  unmoderated_comments: PropTypes.arrayOf(PropTypes.object)
}

// export default ModerateCommentsTodo
const ModerateCommentsTodo = withTranslation()(ModerateCommentsTodoTranslated);
export default withTranslation()(ModerateCommentsTodo);
