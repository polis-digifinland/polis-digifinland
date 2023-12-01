/** @jsx jsx */
import { jsx, Text, Card } from 'theme-ui'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next';

function Conversation({ c, i, goToConversation }) {
  const { t } = useTranslation();
  return (
    <Card
      onClick={goToConversation}
      sx={{ cursor: 'pointer', 'overflow-wrap': 'break-word', mb: [3] }}
      key={i}>
      <Text sx={{ fontWeight: 700, mb: [2] }}>{c.topic}</Text>
      <Text>{c.description}</Text>
      <Text data-test-id="embed-page">
        {c.parent_url ? `Embedded on ${c.parent_url}` : null}
      </Text>
      <Text sx={{ mt: [2] }}>{c.participant_count} {t('conversations.participants')}</Text>
    </Card>
  )
}

Conversation.propTypes = {
  c: PropTypes.shape({
    topic: PropTypes.string,
    description: PropTypes.string,
    parent_url: PropTypes.string,
    participant_count: PropTypes.number
  }),
  i: PropTypes.number.isRequired,
  goToConversation: PropTypes.func.isRequired
}

export default Conversation
