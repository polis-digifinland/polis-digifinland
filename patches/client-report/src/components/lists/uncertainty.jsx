// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import CommentList from "./commentList.jsx";
import * as globals from "../globals.js";
// import style from "../../util/style";
import Narrative from "../narrative/index.jsx";
import { useTranslation } from 'react-i18next';

const Uncertainty = ({
  conversation,
  comments,
  ptptCount,
  uncertainty,
  formatTid,
  math,
  voteColors,
  narrative,
}) => {
  if (!conversation) {
    return <div>Loading Uncertainty...</div>;
  }
  const { t } = useTranslation();
  return (
    <div>
      <p style={globals.primaryHeading}>{t('uncertainty.title')}</p>
      <p style={globals.paragraph}>{t('uncertainty.text', { param1: ptptCount})}</p>
      <p style={globals.paragraph}>{t('uncertainty.desc')}</p>
      <div style={{ marginTop: 50 }}>
        <CommentList
          conversation={conversation}
          ptptCount={ptptCount}
          math={math}
          formatTid={formatTid}
          tidsToRender={uncertainty /* uncertainTids would be funnier */}
          comments={comments}
          voteColors={voteColors}
        />
      </div>
    </div>
  );
};

export default Uncertainty;
