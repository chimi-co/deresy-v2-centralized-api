const marked = require('marked')

const CSS_STYLES = `
  body, h1, h2, p {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-size: 12px;
    font-family: 'Helvetica', sans-serif;
    color: black;
    width: 100%;
    max-width: 720px;
    margin: 0px auto;
    padding: 0px 60px; 
  }

  h1 {
    font-size: 24px;
    margin-bottom: 24px;
    font-weight: normal;
  }

  h2 {
    font-size: 18px;
    margin-bottom: 18px;
    font-weight: normal;
  }

  p {
    margin-bottom: 14px;
    line-height: 1.5; /* Makes text a bit more readable */
  }

  a {
    color: blue;
    text-decoration: none; /* Removes underline */
  }
  a:hover {
    text-decoration: underline; /* Adds underline back when hovering */
  }

  .question {
    margin-left: 20px;
  }

  .page-break {
    page-break-after: always;
  }
  .amendment-card {
    font-size: 14px;
    padding: 5px 15px;
    border: 1px solid #ddd;
    box-shadow: 5px 3px 3px #ddd;
    margin-bottom: 25px;
  }
`

const formatDate = unixTimestamp => {
  const date = new Date(unixTimestamp * 1000)

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Chicago',
  }
  return date.toLocaleString('en-US', options)
}

const generateHeader = (name, tokenID) => `
  <h1 style="margin-bottom: 5px !important">${name}</h1>
  <a href="https://gitcoinreviews.co/hypercerts/${tokenID}" target="_blank">https://gitcoinreviews.co/hypercerts/${tokenID}</a>
  <h2 style="margin-top: 30px !important">Summary</h2>
`

const generateReviewerSection = (
  reviewer,
  hypercertID,
  attestationID,
  easSchemaID,
  createdAt,
  attachmentsIpfsHashes,
) => {
  let attachmentsSection = ''

  if (attachmentsIpfsHashes && attachmentsIpfsHashes.length > 0) {
    attachmentsSection = `
      <p>Attachments:</p>
      <ul>
        ${attachmentsIpfsHashes
          .map(
            hash => `
          <li>
            <a href="https://ipfs.io/ipfs/${hash}" target="_blank">${hash}</a>
          </li>
        `,
          )
          .join('')}
      </ul>
    `
  }

  let attestationIdSection = ''

  if (attestationID) {
    attestationIdSection = `
      <p><strong>Attestation ID:</strong><a href="https://optimism-goerli-bedrock.easscan.org/attestation/view/${attestationID}">${attestationID}</a></p>
    `
  }

  return `
    ${attestationIdSection}
    <p><strong>Reviewer:</strong> ${reviewer}</p>
    <p><strong>Hypercert ID:</strong> ${hypercertID}</p>
    <p>
      <strong>EAS Schema ID:</strong> <a href="https://optimism-goerli-bedrock.easscan.org/schema/view/${easSchemaID}">${easSchemaID}</a>
    </p>
    <p><strong>Created at:</strong> ${formatDate(createdAt)}</p>
    ${attachmentsSection}
  `
}

const generateQuestionsSection = questions => {
  return questions
    .map(
      ({ answer, question }, index) => `
    <p><strong>${index + 1}. ${question}</strong></p>
    <p>${marked.parse(answer)}</p>
  `,
    )
    .join('')
}

const generateAmendmentsSection = amendments => {
  return amendments
    .sort((a, b) => a.createdAt - b.createdAt)
    .map(
      (
        { amendment, attachmentsIpfsHashes, createdAt, amendmentUID },
        index,
      ) => {
        let attachmentsSection = ''
        if (attachmentsIpfsHashes && attachmentsIpfsHashes.length > 0) {
          attachmentsSection = `
            <p>Attachments:</p>
            <ul>
              ${attachmentsIpfsHashes
                .map(
                  hash => `
                <li>
                  <a href="https://ipfs.io/ipfs/${hash}" target="_blank">${hash}</a>
                </li>
              `,
                )
                .join('')}
            </ul>
          `
        }

        let amendmentUIdSection = ''
        if (amendmentUID) {
          amendmentUIdSection = `
          <p><strong>Attestation ID:</strong> <a href="https://optimism-goerli-bedrock.easscan.org/attestation/view/${amendmentUID}">${amendmentUID}</a></p>
        `
        }

        return `
          <p><strong style="font-size: 16px !important">Amendment ${
            index + 1
          }</strong>  (${formatDate(createdAt)})</p>
          ${amendmentUIdSection}
          <div class="amendment-card">${marked.parse(amendment)}</div>
          ${attachmentsSection}
          <hr/>
          <br/>
        `
      },
    )
    .join('')
}

const reviewToHtml = (review = {}) => {
  const {
    name,
    summary,
    reviewer,
    hypercertID,
    easSchemaID,
    questions,
    amendments,
    createdAt,
    attachmentsIpfsHashes,
    tokenID,
    attestationID,
  } = review
  let amendmentsSection = ''

  if (amendments && amendments.length > 0) {
    amendmentsSection = `
      <br/>
      <h2>Amendments</h2>
      ${generateAmendmentsSection(amendments)}
    `
  }
  return `
    <style>${CSS_STYLES}</style>
    ${generateHeader(name, tokenID)}
    <p>${summary}</p>
    <h2>Review</h2>
    ${generateReviewerSection(
      reviewer,
      hypercertID,
      attestationID,
      easSchemaID,
      createdAt,
      attachmentsIpfsHashes,
    )}
    <br>
    ${generateQuestionsSection(questions)}
    ${amendmentsSection}
  `
}

const formatReviews = (reviewForm, review = {}) => {
  const { choices, easSchemaID, questions } = reviewForm
  const {
    answers,
    hypercertID,
    reviewer,
    name,
    summary,
    createdAt,
    attachmentsIpfsHashes,
    tokenID,
    amendments,
    attestationID,
  } = review

  const values = questions.map((question, index) => {
    return {
      question,
      choices: choices[index],
      answer: answers[index],
    }
  })

  return {
    name,
    summary,
    reviewer,
    hypercertID,
    easSchemaID,
    questions: values,
    createdAt,
    attachmentsIpfsHashes,
    tokenID,
    attestationID,
    amendments,
  }
}

const getSixMonthsAgoTimestamp = () => {
  const now = new Date()

  now.setMonth(now.getMonth() - 6)

  const sixMonthsAgoTimestamp = Math.floor(now.getTime() / 1000)

  return sixMonthsAgoTimestamp
}

module.exports = {
  formatReviews,
  reviewToHtml,
  getSixMonthsAgoTimestamp,
}
