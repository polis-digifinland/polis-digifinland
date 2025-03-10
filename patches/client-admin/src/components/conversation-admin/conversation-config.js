// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import {
  handleZidMetadataUpdate,
  optimisticZidMetadataUpdateOnTyping
} from '../../actions'
import ComponentHelpers from '../../util/component-helpers'
import NoPermission from './no-permission'
import { Heading, Box, Text, jsx } from 'theme-ui'
import emoji from 'react-easy-emoji'

import { CheckboxField } from './CheckboxField'
import ModerateCommentsSeed from './seed-comment'
// import ModerateCommentsSeedTweet from "./seed-tweet";

import { withTranslation } from 'react-i18next';

@connect((state) => state.user)
@connect((state) => state.zid_metadata)
class ConversationConfigTranslated extends React.Component {
  handleStringValueChange(field) {
    return () => {
      let val = this[field].value
      if (field === 'help_bgcolor' || field === 'help_color') {
        if (!val.length) {
          val = 'default'
        }
      }
      this.props.dispatch(
        handleZidMetadataUpdate(this.props.zid_metadata, field, val)
      )
    }
  }

  handleConfigInputTyping(field) {
    return (e) => {
      this.props.dispatch(
        optimisticZidMetadataUpdateOnTyping(
          this.props.zid_metadata,
          field,
          e.target.value
        )
      )
    }
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }
    
    const { t } = this.props;

    return (
      <Box>
        <Heading
          as="h3"
          sx={{
            fontSize: [3, null, 4],
            lineHeight: 'body',
            mb: [3, null, 4]
          }}>
          {t('configure.title')}
        </Heading>
        <Box sx={{ mb: [4] }}>
          {this.props.loading ? (
            <Text>{emoji('💾')} {t('configure.saving')}</Text>
          ) : (
            <Text>{emoji('⚡')} {t('configure.up_to_date')}</Text>
          )}
          {this.props.error ? <Text>{t('configure.error')}</Text> : null}
        </Box>

        <CheckboxField field="is_active" label="Conversation Is Open">
          {t('configure.conversation_open')}
        </CheckboxField>

        <Box sx={{ mb: [3] }}>
          <Text sx={{ mb: [2] }}>{t('configure.topic')}</Text>
          <input
            ref={(c) => (this.topic = c)}
            sx={{
              fontFamily: 'body',
              fontSize: [2],
              width: '35em',
              borderRadius: 2,
              padding: [2],
              border: '1px solid',
              borderColor: 'mediumGray'
            }}
            data-test-id="topic"
            onBlur={this.handleStringValueChange('topic').bind(this)}
            onChange={this.handleConfigInputTyping('topic').bind(this)}
            defaultValue={this.props.zid_metadata.topic}
          />
        </Box>

        <Box sx={{ mb: [3] }}>
          <Text sx={{ mb: [2] }}>{t('configure.description')}</Text>
          <textarea
            ref={(c) => (this.description = c)}
            sx={{
              fontFamily: 'body',
              fontSize: [2],
              width: '35em',
              height: '7em',
              resize: 'none',
              padding: [2],
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'mediumGray'
            }}
            data-test-id="description"
            onBlur={this.handleStringValueChange('description').bind(this)}
            onChange={this.handleConfigInputTyping('description').bind(this)}
            defaultValue={this.props.zid_metadata.description}
          />
        </Box>

        <Heading
          as="h6"
          sx={{
            fontSize: [1, null, 2],
            lineHeight: 'body',
            my: [3, null, 4]
          }}>
          {t('configure.seed_comments')}
        </Heading>
        <ModerateCommentsSeed
          params={{ conversation_id: this.props.zid_metadata.conversation_id }}
        />

        {/* <ModerateCommentsSeedTweet
          params={{ conversation_id: this.props.zid_metadata.conversation_id }}
        /> */}

        <Heading
          as="h6"
          sx={{
            fontSize: [1, null, 2],
            lineHeight: 'body',
            my: [3, null, 4]
          }}>
          {t('configure.customize_ui')}
        </Heading>

        {/*<CheckboxField field="importance_enabled" label="Importance Enabled">
          [EXPERIMENTAL FEATURE] Participants can see the &quot;This comment is important&quot; checkbox
        </CheckboxField>*/}

        <CheckboxField field="vis_type" label="Visualization" isIntegerBool>
          {t('configure.vis_type')}
        </CheckboxField>

        <CheckboxField field="write_type" label="Comment form" isIntegerBool>
          {t('configure.write_type')}
        </CheckboxField>

        <CheckboxField field="help_type" label="Help text" isIntegerBool>
          {t('configure.help_type')}
        </CheckboxField>
        
        {
        // hide these settings to avoid accidentally collecting of PII data
        //
        // database schema altered to use subscription_type = 0 as default. (not implemented in polis-server constants.ts)
        // <CheckboxField
        //   field="subscribe_type"
        //   label="Prompt participants to subscribe to updates"
        //   isIntegerBool>
        //   Prompt participants to subscribe to updates. A prompt is shown to
        //   users once they finish voting on all available comments. If enabled,
        //   participants may optionally provide their email address to receive
        //   notifications when there are new comments to vote on.
        // </CheckboxField>
        }

        <Heading
          as="h6"
          sx={{
            fontSize: [1, null, 2],
            lineHeight: 'body',
            my: [3, null, 4]
          }}>
          {t('configure.schemes')}
        </Heading>

        <CheckboxField field="strict_moderation">
          {t('configure.strict_moderation')}
        </CheckboxField>
      </Box>
    )
  }
}

const ConversationConfig = withTranslation()(ConversationConfigTranslated);
export default ConversationConfig;

// checked={this.props.zid_metadata.is_data_open}
// Comments, votes, and group data can be exported by any user

/* <InputField
            ref={"style_btn"}

            style={{ width: 360 }}
            onBlur={this.handleStringValueChange("style_btn").bind(this)}
            hintText="ie., #e63082"
            onChange={this.handleConfigInputTyping("style_btn")}
            value={this.props.zid_metadata.style_btn}
            floatingLabelText={
              "Customize submit button color" + (canCustomizeColors ? "" : lockedIcon)
            }
            multiLine={true}
          /> */

/* <InputField
            ref={"help_bgcolor"}

            style={{ width: 360 }}
            onBlur={this.handleStringValueChange("help_bgcolor").bind(this)}
            onChange={this.handleConfigInputTyping("help_bgcolor")}
            value={this.props.zid_metadata.help_bgcolor}
            hintText="ie., #e63082"
            floatingLabelText={
              "Customize help text background" + (canCustomizeColors ? "" : lockedIcon)
            }
            multiLine={true}
          /> */

/* <InputField
            ref={"help_color"}

            style={{ width: 360 }}
            onBlur={this.handleStringValueChange("help_color").bind(this)}
            onChange={this.handleConfigInputTyping("help_color")}
            value={this.props.zid_metadata.help_color}
            hintText="ie., #e63082"
            floatingLabelText={"Customize help text color" + (canCustomizeColors ? "" : lockedIcon)}
            multiLine={true}
          /> */

/* <Checkbox
            label="Social sharing buttons"
            ref={"socialbtn_type"}
            checked={this.props.zid_metadata.socialbtn_type === 1 ? true : false}
            onCheck={this.handleIntegerBoolValueChange("socialbtn_type").bind(this)}


          /> */
