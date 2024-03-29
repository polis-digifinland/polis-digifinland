// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import NumberCard from './conversation-stats-number-card'

import { withTranslation } from 'react-i18next';

class NumberCardsTranslated extends React.Component {
  render() {
    const data = this.props.data
    const averageVotes = (
      data.voteTimes.length / data.firstVoteTimes.length
    ).toFixed(2)
    const { t } = this.props;
    return (
      <div>
        <NumberCard
          datum={data.firstVoteTimes.length}
          subheading={t('stats.voted')}
          icon="users"
        />
        <NumberCard
          datum={data.voteTimes.length}
          subheading={t('stats.votes')}
          icon="tags"
        />
        <NumberCard
          datum={isNaN(averageVotes) ? 0 : averageVotes}
          subheading={t('stats.average_votes')}
        />
        <NumberCard
          datum={data.firstCommentTimes.length}
          subheading={t('stats.commented')}
          icon="users"
        />
        <NumberCard
          datum={data.commentTimes.length}
          subheading={t('stats.comments_submitted')}
          icon="comments"
        />
      </div>
    )
  }
}

NumberCardsTranslated.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    firstVoteTimes: PropTypes.arrayOf(PropTypes.number),
    firstCommentTimes: PropTypes.arrayOf(PropTypes.number),
    voteTimes: PropTypes.arrayOf(PropTypes.number),
    commentTimes: PropTypes.arrayOf(PropTypes.number)
  })
}

// export default NumberCards
const NumberCards = withTranslation()(NumberCardsTranslated);
export default withTranslation()(NumberCards);
