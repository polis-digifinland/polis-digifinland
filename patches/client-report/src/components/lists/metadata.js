// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import CommentList from "./commentList";
import * as globals from "../globals";
import { useTranslation } from 'react-i18next';

const Metadata = ({ conversation, comments, ptptCount, formatTid, math, voteColors }) => {
  if (!conversation) {
    return <div>Loading Metadata...</div>;
  }

  const _metadataTids = [];

  comments.forEach((comment/*, i*/) => {
    if (comment.is_meta) {
      _metadataTids.push(comment.tid);
    }
  });

  if (_metadataTids.length === 0) {
    return null;
  }
  const { t } = useTranslation();
  return (
    <div>
      <p style={globals.primaryHeading}>{t('metadata.title')}</p>
      <p style={globals.paragraph}>{t('metadata.text')}</p>
      <div style={{ marginTop: 50 }}>
        <CommentList
          conversation={conversation}
          ptptCount={ptptCount}
          math={math}
          formatTid={formatTid}
          tidsToRender={_metadataTids.sort((a, b) => a - b) /* es6 ftw */}
          comments={comments}
          voteColors={voteColors}
        />
      </div>
    </div>
  );
};

export default Metadata;
