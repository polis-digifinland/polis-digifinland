// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState } from "react";
import CommentList from "./commentList.jsx";
import * as globals from "../globals";
import { useTranslation } from 'react-i18next';

const sortFunctions = {
  tid: (comments) => comments.sort((a, b) => a.tid - b.tid).map(c => c.tid),
  numvotes: (comments) => comments.sort((a, b) => b.count - a.count).map(c => c.tid), // Descending order for numvotes
  consensus: (comments) => comments.sort((a, b) => b["group-aware-consensus"] - a["group-aware-consensus"]).map(c => c.tid),
  pctAgreed: (comments) => comments.sort((a, b) => b["pctAgreed"] - a["pctAgreed"]).map(c => c.tid),
  pctDisagreed: (comments) => comments.sort((a, b) => b["pctDisagreed"] - a["pctDisagreed"]).map(c => c.tid),
  pctPassed: (comments) => comments.sort((a, b) => b["pctPassed"] - a["pctPassed"]).map(c => c.tid),
};

const allCommentsModeratedIn = ({ conversation, ptptCount, math, formatTid, comments, voteColors }) => {

  const { t } = useTranslation();
  
  const [sortStyle, setSortStyle] = useState(globals.allCommentsSortDefault)

  const onSortChanged = (event) => {
    setSortStyle(event.target.value)
  };


  if (!conversation) {
    return <div>Loading allCommentsModeratedIn...</div>
  }

  const sortFunction = sortFunctions[sortStyle] || sortFunctions["tid"];

  return (
    <div>
      <p style={globals.primaryHeading}>{t('all_comments.title')}</p>
      <p style={globals.paragraph}>{t('all_comments.text')}</p>
      <label htmlFor="allCommentsSortMode">{t('all_comments.sortby')}</label>
      <select id="allCommentsSortMode" onChange={onSortChanged} value={sortStyle}>
        <option value="tid">{t('all_comments.tid')}</option>
        <option value="consensus">{t('all_comments.consensus')}</option>
        <option value="numvotes">{t('all_comments.numvotes')}</option>
        <option value="pctAgreed">% {t('all_comments.agreed')}</option>
        <option value="pctDisagreed">% {t('all_comments.disagreed')}</option>
        <option value="pctPassed">% {t('all_comments.passed')}</option>
      </select>
      <div style={{marginTop: 50}}>
        <CommentList
          conversation={conversation}
          ptptCount={ptptCount}
          math={math}
          formatTid={formatTid}
          tidsToRender={sortFunction(comments)}
          comments={comments}
          voteColors={voteColors}/>
      </div>
    </div>
  );
}

export default allCommentsModeratedIn;
