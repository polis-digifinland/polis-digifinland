// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";
import CommentList from "./commentList";
import * as globals from "../globals";

import { withTranslation } from 'react-i18next';

function sortByTid(comments) {
  return _.map(comments, (comment) => comment.tid).sort((a, b) => a - b);
}

function sortByVoteCount(comments) {
  return _.map(_.reverse(_.sortBy(comments, "count")), (c) => {return c.tid;});
}
function sortByGroupAwareConsensus(comments) {
  return _.map(_.reverse(_.sortBy(comments, (c) => {return c["group-aware-consensus"];})), (c) => {return c.tid;});
}
function sortByPctAgreed(comments) {
  return _.map(_.reverse(_.sortBy(comments, (c) => {return c["pctAgreed"];})), (c) => {return c.tid;});
}
function sortByPctDisagreed(comments) {
  return _.map(_.reverse(_.sortBy(comments, (c) => {return c["pctDisagreed"];})), (c) => {return c.tid;});
}
function sortByPctPassed(comments) {
  return _.map(_.reverse(_.sortBy(comments, (c) => {return c["pctPassed"];})), (c) => {return c.tid;});
}

class allCommentsModeratedInTranslated extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortStyle: globals.allCommentsSortDefault,
    };
  }

  onSortChanged(event) {
    this.setState({
      sortStyle: event.target.value,
    });
  }

  render() {

    if (!this.props.conversation) {
      return <div>Loading allCommentsModeratedIn...</div>
    }

    let sortFunction = null;
    if (this.state.sortStyle === "tid") {
      sortFunction = sortByTid;
    } else if (this.state.sortStyle === "numvotes") {
      sortFunction = sortByVoteCount;
    } else if (this.state.sortStyle === "consensus") {
      sortFunction = sortByGroupAwareConsensus;
    } else if (this.state.sortStyle === "pctAgreed") {
      sortFunction = sortByPctAgreed;
    } else if (this.state.sortStyle === "pctDisagreed") {
      sortFunction = sortByPctDisagreed;
    } else if (this.state.sortStyle === "pctPassed") {
      sortFunction = sortByPctPassed;
    } else {
      console.error('missing sort function', this.state.sortStyle);
    }
    const { t } = this.props;
    return (
      <div>
        <p style={globals.primaryHeading}>{t('all_comments.title')}</p>
        <p style={globals.paragraph}>{t('all_comments.text')}</p>
        <label htmlFor="allCommentsSortMode">{t('all_comments.sortby')}</label>
        <select id="allCommentsSortMode" onChange={this.onSortChanged.bind(this)} value={this.state.sortStyle}>
          <option value="tid">{t('all_comments.tid')}</option>
          <option value="consensus">{t('all_comments.consensus')}</option>
          <option value="numvotes">{t('all_comments.numvotes')}</option>
          <option value="pctAgreed">% {t('all_comments.agreed')}</option>
          <option value="pctDisagreed">% {t('all_comments.disagreed')}</option>
          <option value="pctPassed">% {t('all_comments.passed')}</option>
        </select>
        <div style={{marginTop: 50}}>
          <CommentList
            conversation={this.props.conversation}
            ptptCount={this.props.ptptCount}
            math={this.props.math}
            formatTid={this.props.formatTid}
            tidsToRender={sortFunction(this.props.comments)}
            comments={this.props.comments}
            voteColors={this.props.voteColors}/>
        </div>
      </div>
    );
  }
}

//export default allCommentsModeratedIn;
const allCommentsModeratedIn = withTranslation()(allCommentsModeratedInTranslated);
export default withTranslation()(allCommentsModeratedIn);