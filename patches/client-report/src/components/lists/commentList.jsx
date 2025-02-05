// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import * as globals from "../globals";

import { useTranslation } from 'react-i18next';

const BarChartCompact = ({ comment, voteCounts, nMembers, voteColors }) => {
  if (!comment) return null;

  let w = 100;
  let agrees = 0;
  let disagrees = 0;
  let sawTheComment = 0;
  let missingCounts = false;

  if (typeof voteCounts != "undefined") {
    agrees = voteCounts.A;
    disagrees = voteCounts.D;
    sawTheComment = voteCounts.S;
  } else {
    missingCounts = true;
  }
  let passes = sawTheComment - (agrees + disagrees);
  // let totalVotes = agrees + disagrees + passes;

  const agree = (agrees / nMembers) * w;
  const disagree = (disagrees / nMembers) * w;
  const pass = (passes / nMembers) * w;
  // const blank = nMembers - (sawTheComment / nMembers) * w;

  const agreeSaw = (agrees / sawTheComment) * w;
  const disagreeSaw = (disagrees / sawTheComment) * w;
  const passSaw = (passes / sawTheComment) * w;

  const agreeString = (agreeSaw << 0) + "% ";
  const disagreeString = (disagreeSaw << 0) + "% ";
  const passString = (passSaw << 0) + "% ";

  const { t } = useTranslation();
  
  return (
    <div
      title={
        agreeString + t('comment_list.agreed')+"\n"+
        disagreeString + t('comment_list.disagreed')+"\n"+
        passString + t('comment_list.passed')+"\n"+
        sawTheComment + t('comment_list.respondents')
      }
    >
      <svg width={101} height={10} style={{ marginRight: 30 }}>
        <g>
          <rect x={0} width={w + 0.5} height={10} fill={"white"} stroke={"rgb(180,180,180)"} />
          <rect x={0.5 + agree + disagree} width={pass} y={0.5} height={9} fill={voteColors.pass} />
          <rect x={0.5} width={agree} y={0.5} height={9} fill={voteColors.agree} />
          <rect x={0.5 + agree} width={disagree} y={0.5} height={9} fill={voteColors.disagree} />
        </g>
      </svg>
      <div>
        {missingCounts ? (
          <span style={{ fontSize: 12, marginRight: 4, color: "grey" }}>Missing vote counts</span>
        ) : (
          <span>
            <span style={{ fontSize: 12, marginRight: 4, color: voteColors.agree }}>
              {agreeString}
            </span>
            <span style={{ fontSize: 12, marginRight: 4, color: voteColors.disagree }}>
              {disagreeString}
            </span>
            <span style={{ fontSize: 12, marginRight: 4, color: "#999" }}>{passString}</span>
            <span style={{ fontSize: 12, color: "grey" }}>({sawTheComment})</span>
          </span>
        )}
      </div>
    </div>
  );
};

const CommentRow = ({ comment, groups, voteColors }) => {
  if (!comment) {
    console.error("WHY IS THERE NO COMMENT 3452354235", comment);
    return null;
  }

  let BarCharts = [];
  let totalMembers = 0;

  // groups
  Object.entries(groups).forEach(([key, g]) => {
    const i = parseInt(key, 10); // Parse the key to an integer
    const nMembers = g["n-members"];
    totalMembers += nMembers;
    const gVotes = g.votes[comment.tid];
  
    BarCharts.push(
      <BarChartCompact
        key={i}
        index={i}
        comment={comment}
        voteCounts={gVotes}
        nMembers={nMembers}
        voteColors={voteColors}
      />
    );
  });

  BarCharts.unshift(
    <BarChartCompact
      key={99}
      index={99}
      comment={comment}
      voteCounts={{
        A: comment.agreed,
        D: comment.disagreed,
        S: comment.saw,
      }}
      nMembers={totalMembers}
      voteColors={voteColors}
    />
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 0px",
        borderBottom: "1px solid rgb(220,220,220)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          width: 20,
          marginRight: 10,
        }}
      >
        {comment.tid}
      </span>

      <span
        style={{
          fontSize: 12,
          width: 200,
          marginRight: 50,
        }}
      >
        {comment.txt}
      </span>
      {BarCharts}
    </div>
  );
};

const CommentList = ({ comments, math, ptptCount, tidsToRender, voteColors }) => {

  const { t } = useTranslation();
  
  const getGroupLabels = () => {
    function makeLabel(key, label, numMembers) {
      return (
        <span
          key={key}
          style={{
            width: 101,
            marginRight: 30,
            display: "inline-block",
            fontWeight: 400,
            fontSize: 14,
            textTransform: "uppercase",
          }}
        >
          {label}
          <span
            style={{
              marginLeft: 5,
            }}
          >
            {numMembers}
          </span>
        </span>
      );
    }
    let labels = [];

    // totals
    labels.push(makeLabel(99, t('comment_list.overall'), ptptCount));

    Object.entries(math["group-votes"]).forEach(([key, g]) => {
      const i = parseInt(key, 10);
      labels.push(makeLabel(i, globals.groupLabels[i], g["n-members"]));
    });

    return labels;
  }

  const cs = comments.reduce((acc, comment) => {
    acc[comment.tid] = comment;
    return acc;
  }, {});

  return (
    <div>
      <div
        style={{
          marginBottom: 1,
          borderBottom: "2px solid black",
          position: "relative",
        }}
      >
        <span
          style={{
            minWidth: 200,
            marginRight:
              50 + 10 + 33 /* the 10 in padding from the cells, the 33 for offset group labels */,
            display: "inline-block",
            fontWeight: 700,
            fontSize: 14,
            textTransform: "uppercase",
          }}
        >
          {t('comment_list.statement')}
        </span>

        {getGroupLabels()}
      </div>
      {tidsToRender.map((tid, i) => {
        return (
          <CommentRow
            key={i}
            index={i}
            groups={math["group-votes"]}
            comment={cs[tid]}
            voteColors={voteColors}
          />
        );
      })}
    </div>
  );
}

export default CommentList;
