// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";
import * as globals from "./globals";

import { useTranslation } from 'react-i18next';

const computeVoteTotal = (users) => {
  let voteTotal = 0;

  _.each(users, (count) => {
    voteTotal += count
  });

  return voteTotal;
}

// const computeUniqueCommenters = (comments) => {

// }

const Number = ({number, label}) => (
  <div style={{marginLeft: "10px", marginRight: "10px"}}>
    <p style={globals.overviewNumber}>
      {number.toLocaleString()}
    </p>
    <p style={globals.overviewLabel}>
      {label}
    </p>
  </div>
)

const Overview = ({
  conversation,
  // demographics,
  ptptCount,
  ptptCountTotal,
  math,
  // comments,
  //stats,
  computedStats,
}) => {
  const { t } = useTranslation();
  return (
    <div >
      <p style={globals.primaryHeading}>{t('overview.title')}</p>
      <p style={globals.paragraph}>{t('overview.text')}</p>
      <p style={globals.paragraph}><strong>{t('overview.term_participants_title')}:</strong> {t('overview.term_participants_text')}</p>
      <p style={globals.paragraph}><strong>{t('overview.term_statements_title')}:</strong> {t('overview.term_statements_text')}</p>
      <p style={globals.paragraph}><strong>{t('overview.term_opinion_groups_title')}:</strong> {t('overview.term_opinion_groups_text')}</p>

      <p style={globals.paragraph}>
        {conversation && conversation.ownername ? t('overview.ownername_text')+"'"+conversation.ownername+"'. " : null}
        {conversation && conversation.topic ? t('overview.topic_text')+"'"+conversation.topic+"'. " : null}
      </p>
      <div style={{maxWidth: 1200, display: "flex", justifyContent: "space-between"}}>
        <Number number={ptptCountTotal} label={t('overview.people_voted')} />
        <Number number={ptptCount} label={t('overview.people_grouped')} />

        <Number
          number={ computeVoteTotal(math["user-vote-counts"]) }
          label={t('overview.votes_cast')} />
        {/* Leaving this out for now until we get smarter conversationStats */}
        {/* <Number number={comments.length} label={"people submitted statements"} /> */}
        <Number number={math["n-cmts"]} label={t('overview.statements_submitted')} />
        <Number number={computedStats.votesPerVoterAvg.toFixed(2)} label={t('overview.votes_per_voter_avg')} />
        <Number number={computedStats.commentsPerCommenterAvg.toFixed(2)} label={t('overview.statements_per_author_avg')} />

      </div>

    </div>
  );
};

export default Overview;

// <p style={globals.paragraph}> {conversation && conversation.participant_count ? "A total of "+ptptCount+" people participated. " : null} </p>


// It was presented {conversation ? conversation.medium : "loading"} to an audience of {conversation ? conversation.audiences : "loading"}.
// The conversation was run for {conversation ? conversation.duration : "loading"}.
 // {demographics ? demographics.foo : "loading"} were women

 // {conversation && conversation.description ? "The specific question was '"+conversation.description+"'. ": null}
