// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState, useEffect } from "react";

import * as globals from "./globals.js";
import URLs from "../util/url.js";
import DataUtils from "../util/dataUtils.js";
import Heading from "./framework/heading.jsx";
import Footer from "./framework/Footer.jsx";
import Overview from "./overview.jsx";
import NarrativeOverview from "./narrativeOverview.jsx";
import MajorityStrict from "./lists/majorityStrict.jsx";
import Uncertainty from "./lists/uncertainty.jsx";
import UncertaintyNarrative from "./lists/uncertaintyNarrative.jsx";
import GroupsNarrative from "./lists/groupsNarrative.jsx";
import AllCommentsModeratedIn from "./lists/allCommentsModeratedIn.jsx";
import ParticipantGroups from "./lists/participantGroups.jsx";
import ParticipantsGraph from "./participantsGraph/participantsGraph.jsx";
import Beeswarm from "./beeswarm/beeswarm.jsx";
import Controls from "./controls/controls.jsx";
import net from "../util/net.js";
import ConsensusNarrative from "./lists/consensusNarrative.jsx";
import TopicNarrative from "./lists/topicNarrative.jsx";

const pathname = window.location.pathname; // "/report/2arcefpshi"
const report_id = pathname.split("/")[2];

function assertExists(obj, key) {
  if (typeof obj[key] === "undefined") {
    console.error("assertExists failed. Missing: ", key);
  }
}

const App = (props) => {
  const [loading, setLoading] = useState(true);
  const [consensus, setConsensus] = useState(null);
  const [math, setMath] = useState(null);
  const [comments, setComments] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [groupDemographics, setGroupDemographics] = useState(null);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [model, setModel] = useState("openai");
  const [isNarrativeReport, setIsNarrativeReport] = useState(
    window.location.pathname.split("/")[1] === "narrativeReport"
  );
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [shouldPoll, setShouldPoll] = useState(false);
  const [voteColors, setVoteColors] = useState({
    agree: globals.brandColors.agree,
    disagree: globals.brandColors.disagree,
    pass: globals.brandColors.pass,
  });
  const [narrative, setNarrative] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [extremity, setExtremity] = useState(null);
  const [uncertainty, setUncertainty] = useState(null);
  const [ptptCount, setPtptCount] = useState(null);
  const [ptptCountTotal, SetPtptCountTotal] = useState(null);
  const [filteredCorrelationMatrix, setFilteredCorrelationMatrix] = useState(null);
  const [filteredCorrelationTids, setFilteredCorrelationTids] = useState(null);
  const [badTids, setBadTids] = useState(null);
  const [groupNames, setGroupNames] = useState(null);
  const [repfulAgreeTidsByGroup, setRepfulAgreeTidsByGroup] = useState(null);
  const [repfulDisageeTidsByGroup, setRepfulDisageeTidsByGroup] = useState(null);
  const [formatTid, setFormatTid] = useState(() => (v) => v);
  const [report, setReport] = useState(null);
  const [computedStats, setComputedStats] = useState(null);
  const [nothingToShow, setNothingToShow] = useState(true);
  const [hasError, setError] = useState(false);
  const [parsedNarrativeUncertainty, setParsedNarrativeUncertainty] = useState(null);
  const [parsedNarrativeConsensus, setParsedNarrativeConsensus] = useState(null);
  const [parsedNarrativeGroups, setParsedNarrativeGroups] = useState(null);
  const [searchParamsSection, setSearchParamsSection] = useState(
    window.location.search.includes("section=")
      ? window.location.search.split("section=")[1]?.split("&")[0]
      : null
  );
  const [searchParamsModel, setSearchParamModel] = useState(
    window.location.search.includes("model=")
      ? window.location.search.split("model=")[1]?.split("&")[0]
      : "openai"
  );
  const [searchParamsCache, setSearchParamCache] = useState(
    window.location.search.includes("noCache=")
      ? window.location.search.split("noCache=")[1]?.split("&")[0]
      : "false"
  );

  let corMatRetries;

  useEffect(() => {
    if (
      window.location.pathname.split("/")[1] === "narrativeReport" &&
      isNarrativeReport !== true
    ) {
      setIsNarrativeReport(true);
    } else if (isNarrativeReport && window.location.pathname.split("/")[1] !== "narrativeReport") {
      setIsNarrativeReport(false);
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get("section")) setSearchParamsSection(urlParams.get("section"));
    if (urlParams.get("model")) setSearchParamModel(urlParams.get("model"));
    if (urlParams.get("noCache")) setSearchParamCache(urlParams.get("noCache"));
  }, [window.location?.pathname, window.location?.search]);

  useEffect(() => {
    if (narrative?.group_informed_consensus) {
      setParsedNarrativeConsensus(narrative.group_informed_consensus);
    }
    if (narrative?.uncertainty) {
      setParsedNarrativeUncertainty(narrative.uncertainty);
    }
    if (narrative?.groups) {
      setParsedNarrativeGroups(narrative.groups);
    }
  }, [
    narrative?.uncertainty,
    narrative?.group_informed_consensus,
    narrative?.groups,
    JSON.stringify(narrative),
  ]);

  useEffect(() => {
    if (narrative) {
      console.log("Current narrative state:", {
        timestamp: new Date().toISOString(),
        sections: Object.keys(narrative),
        fullNarrative: narrative,
      });
    }
  }, [narrative]);

  const getMath = async (conversation_id) => {
    return net
      .polisGet("/api/v3/math/pca2", {
        lastVoteTimestamp: 0,
        conversation_id: conversation_id,
      })
      .then((data) => {
        if (!data) {
          return {};
        }
        return data;
      });
  };

  const getComments = (conversation_id, isStrictMod) => {
    return net.polisGet("/api/v3/comments", {
      conversation_id: conversation_id,
      report_id: report_id,
      moderation: true,
      mod_gt: isStrictMod ? 0 : -1,
      //include_social: true,
      //include_demographics: true,
      include_voting_patterns: true,
    });
  };

  const getParticipantsOfInterest = (conversation_id) => {
    return net.polisGet("/api/v3/ptptois", {
      conversation_id: conversation_id,
    });
  };
  const getConversation = (conversation_id) => {
    return net.polisGet("/api/v3/conversations", {
      conversation_id: conversation_id,
    });
  };

  const getNarrative = async (report_id) => {
    const urlPrefix = URLs.urlPrefix;
    try {
      const response = await fetch(
        `${urlPrefix}api/v3/reportNarrative?report_id=${report_id}${
          searchParamsSection ? `&section=${searchParamsSection}` : ``
        }${searchParamsModel ? `&model=${searchParamsModel}` : ``}${searchParamsCache ? `&noCache=${searchParamsCache}` : ``}`,
        {
          credentials: "include",
          method: "get",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { value, done } = await reader.read();

          if (done) break;

          const decodedChunk = decoder.decode(value, { stream: true });

          if (!decodedChunk.includes("POLIS-PING:")) {
            decodedChunk
              .split(`|||`)
              .filter(Boolean)
              .forEach((j) => {
                try {
                  const c = JSON.parse(j);
                  setNarrative((prevNarrative) => ({
                    ...(prevNarrative || {}),
                    ...c,
                  }));
                } catch (error) {
                  console.warn("Error parsing narrative chunk:", error);
                }
              });
          }
        }
      } catch (streamError) {
        console.warn("Stream was interrupted:", streamError);
        // Optionally retry or handle the interruption
        // You could set a flag in state to show a "Connection interrupted" message
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("Failed to fetch narrative:", error);
      // Handle the error appropriately - maybe set an error state
    }
  };

  const getReport = (report_id) => {
    return net
      .polisGet("/api/v3/reports", {
        report_id: report_id,
      })
      .then((reports) => {
        if (reports.length) {
          return reports[0];
        }
        return null;
      });
  };
  const getGroupDemographics = (conversation_id) => {
    return net.polisGet("/api/v3/group_demographics", {
      conversation_id: conversation_id,
      report_id: report_id,
    });
  };

  const getConversationStats = (conversation_id) => {
    return net.polisGet("/api/v3/conversationStats", {
      conversation_id: conversation_id,
      report_id: report_id,
    });
  };

  const getCorrelationMatrix = (math_tick) => {
    const attemptResponse = net.polisGet("/api/v3/math/correlationMatrix", {
      math_tick: math_tick,
      report_id: report_id,
    });

    return new Promise((resolve, reject) => {
      attemptResponse.then(
        (response) => {
          if (response.status && response.status === "pending") {
            if (typeof corMatRetries === "number") {
              corMatRetries = corMatRetries + 1;
            } else {
              corMatRetries = 1;
            }
            setTimeout(
              () => {
                getCorrelationMatrix(math_tick).then(resolve, reject);
              },
              corMatRetries < 10 ? 200 : 3000
            ); // try to get a quick response, but don't keep polling at that rate for more than 10 seconds.
          } else if (
            globals.enableMatrix &&
            response &&
            response.status === "polis_report_needs_comment_selection"
          ) {
            setErrorText("Select some comments");
            reject("Currently, No comments are selected for display in the matrix.");
          } else {
            resolve(response);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  };

  const getData = async () => {
    const reportPromise = getReport(report_id);
    const mathPromise = reportPromise.then((report) => {
      return getMath(report.conversation_id);
    });
    const commentsPromise = reportPromise.then((report) => {
      return conversationPromise.then((conv) => {
        return getComments(report.conversation_id, conv.strict_moderation);
      });
    });
    const groupDemographicsPromise = reportPromise.then((report) => {
      return getGroupDemographics(report.conversation_id);
    });
    const participantsOfInterestPromise = reportPromise.then((report) => {
      return getParticipantsOfInterest(report.conversation_id);
    });
    const matrixPromise = globals.enableMatrix
      ? mathPromise.then((math) => {
          const math_tick = math.math_tick;
          return getCorrelationMatrix(math_tick);
        })
      : Promise.resolve();
    const conversationPromise = reportPromise.then((report) => {
      return getConversation(report.conversation_id);
    });

    const narrativePromise = reportPromise.then((report) => {
      if (isNarrativeReport) getNarrative(report.report_id);
    });

    Promise.all([
      reportPromise,
      mathPromise,
      commentsPromise,
      groupDemographicsPromise,
      participantsOfInterestPromise,
      matrixPromise,
      conversationPromise,
      narrativePromise,
    ])
      .then((a) => {
        let [
          _report,
          mathResult,
          _comments,
          _groupDemographics,
          _participants,
          correlationHClust,
          _conversation,
          narrative,
        ] = a;

        assertExists(mathResult, "base-clusters");
        assertExists(mathResult, "consensus");
        assertExists(mathResult, "group-aware-consensus");
        assertExists(mathResult, "group-clusters");
        assertExists(mathResult, "group-votes");
        assertExists(mathResult, "n-cmts");
        assertExists(mathResult, "repness");
        assertExists(mathResult, "pca");
        assertExists(mathResult, "tids");
        assertExists(mathResult, "user-vote-counts");
        assertExists(mathResult, "votes-base");
        assertExists(mathResult.pca, "center");
        assertExists(mathResult.pca, "comment-extremity");
        assertExists(mathResult.pca, "comment-projection");
        assertExists(mathResult.pca, "comps");

        let indexToTid = mathResult.tids;

        // # ptpts that voted
        var _ptptCountTotal = _conversation.participant_count;

        // # ptpts that voted enough to be included in math
        var _ptptCount = 0;
        const groupVotes = mathResult["group-votes"];
        for (const key in groupVotes) {
          const val = groupVotes[key];
          _ptptCount += val["n-members"];
        }

        var _badTids = {};
        var _filteredTids = {};
        var _filteredProbabilities = {};

        // prep Correlation matrix.
        if (globals.enableMatrix && correlationHClust) {
          var probabilities = correlationHClust.matrix;
          var tids = correlationHClust.comments;
          for (let row = 0; row < probabilities.length; row++) {
            if (probabilities[row][0] === "NaN") {
              let tid = correlationHClust.comments[row];
              _badTids[tid] = true;
            }
          }
          _filteredProbabilities = probabilities
            .map((row) => {
              return row.filter((cell, colNum) => {
                let colTid = correlationHClust.comments[colNum];
                return _badTids[colTid] !== true;
              });
            })
            .filter((row, rowNum) => {
              let rowTid = correlationHClust.comments[rowNum];
              return _badTids[rowTid] !== true;
            });
          _filteredTids = tids.filter((tid /*, index*/) => {
            return _badTids[tid] !== true;
          });
        }

        var maxTid = -1;
        for (let i = 0; i < _comments.length; i++) {
          if (_comments[i].tid > maxTid) {
            maxTid = _comments[i].tid;
          }
        }
        var tidWidth = ("" + maxTid).length;

        function pad(n, width, z) {
          z = z || "0";
          n = n + "";
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
        function _formatTid(tid) {
          return pad("" + tid, tidWidth);
        }

        const _repfulAgreeTidsByGroup = {};
        const _repfulDisageeTidsByGroup = {};

        if (mathResult.repness) {
          for (const gid in mathResult.repness) {
            const entries = mathResult.repness[gid];

            entries.forEach((entry) => {
              if (entry["repful-for"] === "agree") {
                _repfulAgreeTidsByGroup[gid] = _repfulAgreeTidsByGroup[gid] || [];
                _repfulAgreeTidsByGroup[gid].push(entry.tid);
              } else if (entry["repful-for"] === "disagree") {
                _repfulDisageeTidsByGroup[gid] = _repfulDisageeTidsByGroup[gid] || [];
                _repfulDisageeTidsByGroup[gid].push(entry.tid);
              }
            });
          }
        }

        // ====== REMEMBER: gid's start at zero, (0, 1, 2) but we show them as group 1, 2, 3 in participation view ======
        let _groupNames = {};
        for (let i = 0; i <= 9; i++) {
          let label = _report["label_group_" + i];
          if (label) {
            _groupNames[i] = label;
          }
        }

        let _uncertainty = [];
        _comments.map((c) => {
          var unc = c.pass_count / c.count;
          if (unc > 0.3) {
            c.unc = unc;
            _uncertainty.push(c);
          }
        });
        _uncertainty.sort((a, b) => {
          return b.unc * b.unc * b.pass_count - a.unc * a.unc * a.pass_count;
        });
        _uncertainty = _uncertainty.slice(0, 5);

        const _extremity = {};

        for (const index in mathResult.pca["comment-extremity"]) {
          const e = mathResult.pca["comment-extremity"][index];
          const tid = indexToTid[index];
          _extremity[tid] = e;
        }

        var uniqueCommenters = {};
        var voteTotals = DataUtils.getVoteTotals(mathResult);
        _comments = _comments.map((c) => {
          c["group-aware-consensus"] = mathResult["group-aware-consensus"][c.tid];
          uniqueCommenters[c.pid] = 1;
          c = Object.assign(c, voteTotals[c.tid]);
          return c;
        });
        var numUniqueCommenters = Object.keys(uniqueCommenters).length;
        let totalVotes = 0;
        for (const key in mathResult["user-vote-counts"]) {
          totalVotes += mathResult["user-vote-counts"][key];
        }
        const _computedStats = {
          votesPerVoterAvg: totalVotes / _ptptCountTotal,
          commentsPerCommenterAvg: _comments.length / numUniqueCommenters,
        };

        setLoading(false);
        setMath(mathResult);
        setConsensus(mathResult.consensus);
        setExtremity(_extremity);
        setUncertainty(
          _uncertainty.map((c) => {
            return c.tid;
          })
        );
        setComments(_comments);
        setGroupDemographics(_groupDemographics);
        setParticipants(_participants);
        setConversation(_conversation);
        setPtptCount(_ptptCount);
        SetPtptCountTotal(_ptptCountTotal);
        setFilteredCorrelationMatrix(_filteredProbabilities);
        setFilteredCorrelationTids(_filteredTids);
        setBadTids(_badTids);
        setGroupNames(_groupNames);
        setRepfulAgreeTidsByGroup(_repfulAgreeTidsByGroup);
        setRepfulDisageeTidsByGroup(_repfulDisageeTidsByGroup);
        setFormatTid(() => _formatTid);
        setReport(_report);
        setComputedStats(_computedStats);
        setNothingToShow(!_comments.length || !_groupDemographics.length);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setErrorText(String(err));
      });
  };

  useEffect(() => {
    const init = async () => {
      await getData();
      setInterval(() => {
        if (shouldPoll) {
          getData();
        }
      }, 20 * 1000);
    };
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 500);
    });
    init();
  }, []);

  const onAutoRefreshEnabled = () => {
    setShouldPoll(true);
  };

  const onAutoRefreshDisabled = () => {
    setShouldPoll(false);
  };

  const handleColorblindModeClick = () => {
    var colorBlind = !colorBlindMode;
    if (colorBlind) {
      setColorBlindMode(colorBlind);
      setVoteColors(
        Object.assign(voteColors, {
          agree: globals.brandColors.agreeColorblind,
        })
      );
    } else {
      setColorBlindMode(colorBlind);
      setVoteColors(
        Object.assign(voteColors, {
          agree: globals.brandColors.agree,
        })
      );
    }
  };

  if (hasError) {
    return (
      <div data-testid="reports-overview">
        <div> Error Loading </div>
        <div> {errorText} </div>
      </div>
    );
  }
  if (nothingToShow) {
    return (
      <div data-testid="reports-overview">
        <div> Nothing to show yet </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div data-testid="reports-overview">
        <div> Loading ... </div>
      </div>
    );
  }

  return (
    <div style={{ margin: "0px 10px" }} data-testid="reports-overview">
      <Heading conversation={conversation} />
      <div
        style={{
          marginLeft: 20,
          marginTop: 40,
        }}
      >
        <Controls
          onAutoRefreshEnabled={onAutoRefreshEnabled}
          handleColorblindModeClick={handleColorblindModeClick}
          colorBlindMode={colorBlindMode}
          onAutoRefreshDisabled={onAutoRefreshDisabled}
          autoRefreshEnabled={shouldPoll}
          voteColors={voteColors}
        />

        {/* This may eventually need to go back in below */}
        {/* stats={conversationStats} */}

        {isNarrativeReport && (
          <NarrativeOverview
            conversation={conversation}
            ptptCount={ptptCount}
            ptptCountTotal={ptptCountTotal}
            math={math}
            computedStats={computedStats}
            demographics={groupDemographics}
          />
        )}

        {!isNarrativeReport && (
          <Overview
            computedStats={computedStats}
            math={math}
            comments={comments}
            ptptCount={ptptCount}
            ptptCountTotal={ptptCountTotal}
            demographics={groupDemographics}
            conversation={conversation}
            voteColors={voteColors}
          />
        )}


        {isNarrativeReport ? (
          <>
            {searchParamsModel === null && (
              <button onClick={() => setModel((m) => (m === "claude" ? "gemini" : "claude"))}>
                Toggle Model
              </button>
            )}
            <h4>Current Model: {searchParamsModel || model}</h4>
            {parsedNarrativeConsensus ? (
              <ConsensusNarrative
                math={math}
                comments={comments}
                conversation={conversation}
                ptptCount={ptptCount}
                formatTid={formatTid}
                voteColors={voteColors}
                narrative={parsedNarrativeConsensus}
                model={model}
                searchParamsModel={searchParamsModel}
              />
            ) : (
              "...Loading Consensus \n"
            )}
            {parsedNarrativeGroups ? (
              <GroupsNarrative
                math={math}
                comments={comments}
                conversation={conversation}
                ptptCount={ptptCount}
                formatTid={formatTid}
                voteColors={voteColors}
                narrative={parsedNarrativeGroups}
                model={model}
              />
            ) : (
              "...Loading Groups \n"
            )}
            {parsedNarrativeUncertainty ? (
              <UncertaintyNarrative
                math={math}
                comments={comments}
                uncertainty={uncertainty}
                conversation={conversation}
                ptptCount={ptptCount}
                formatTid={formatTid}
                voteColors={voteColors}
                narrative={parsedNarrativeUncertainty}
                model={model}
                searchParamsModel={searchParamsModel}
              />
            ) : (
              "...Loading Uncertainty \n"
            )}
            {Object.keys(narrative || {})
              .filter((key) => key.startsWith("topic_"))
              .map((topicKey) => {
                const topicName = topicKey.replace("topic_", "").replace(/_/g, " ");
                return (
                  <TopicNarrative
                    key={topicKey}
                    math={math}
                    comments={comments}
                    conversation={conversation}
                    ptptCount={ptptCount}
                    formatTid={formatTid}
                    voteColors={voteColors}
                    narrative={narrative[topicKey]}
                    model={model}
                    topicName={topicName}
                  />
                );
              })}
          </>
        ) : (
          <>
            <Beeswarm
              conversation={conversation}
              extremity={extremity}
              math={math}
              comments={comments}
              probabilities={filteredCorrelationMatrix}
              probabilitiesTids={filteredCorrelationTids}
              voteColors={voteColors}
              formatTid={formatTid}
            />
            <MajorityStrict
              math={math}
              conversation={conversation}
              ptptCount={ptptCount}
              comments={comments}
              formatTid={formatTid}
              consensus={consensus}
              voteColors={voteColors}
            />
            <ParticipantGroups
              comments={comments}
              conversation={conversation}
              demographics={groupDemographics}
              ptptCount={ptptCount}
              groupNames={groupNames}
              formatTid={formatTid}
              math={math}
              badTids={badTids}
              repfulAgreeTidsByGroup={repfulAgreeTidsByGroup}
              repfulDisageeTidsByGroup={repfulDisageeTidsByGroup}
              report={report}
              voteColors={voteColors}
            />
            <Uncertainty
              math={math}
              comments={comments}
              uncertainty={uncertainty}
              conversation={conversation}
              ptptCount={ptptCount}
              formatTid={formatTid}
              voteColors={voteColors}
              narrative={narrative}
            />
            {/* {false ? <CommentsGraph
              comments={comments}
              groupNames={groupNames}
              badTids={badTids}
              formatTid={formatTid}
              repfulAgreeTidsByGroup={repfulAgreeTidsByGroup}
              math={math}
              renderHeading={true}
              report={report}
              voteColors={voteColors}/> : null}
            {globals.enableMatrix && false ? <Matrix
              probabilities={filteredCorrelationMatrix}
              comments={comments}
              tids={filteredCorrelationTids}
              formatTid={formatTid}
              ptptCount={ptptCount}
              voteColors={voteColors}/> : ""} */}
            <ParticipantsGraph
              comments={comments}
              groupNames={groupNames}
              badTids={badTids}
              colorBlindMode={colorBlindMode}
              formatTid={formatTid}
              repfulAgreeTidsByGroup={repfulAgreeTidsByGroup}
              math={math}
              renderHeading={true}
              report={report}
              voteColors={voteColors}
            />
            {/* <BoxPlot
              groupVotes={math["group-votes"]}/>*/}
            <AllCommentsModeratedIn
              math={math}
              comments={comments}
              conversation={conversation}
              ptptCount={ptptCount}
              formatTid={formatTid}
              voteColors={voteColors}
            />
          </>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default App;
