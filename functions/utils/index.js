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
    margin: 40px auto;
    padding: 40px 60px; 
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
`

const generateHeader = name => `
  <h1>${name}</h1>
  <h2>Summary</h2>
`

const generateReviewerSection = (reviewer, hypercertID, easSchemaID) => `
  <p>Reviewer: ${reviewer}</p>
  <p>Hypercert ID: ${hypercertID}</p>
  <p>
    EAS Schema ID: <a href="https://optimism-goerli-bedrock.easscan.org/schema/view/${easSchemaID}">${easSchemaID}</a>
  </p>
`

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

const reviewToHtml = (review = {}) => {
  const { easSchemaID, hypercertID, name, summary, reviewer, questions } =
    review
  return `
    <style>${CSS_STYLES}</style>
    ${generateHeader(name)}
    <p>${summary}</p>
    ${generateReviewerSection(reviewer, hypercertID, easSchemaID)}
    <br>
    <h2>Review</h2>
    ${generateQuestionsSection(questions)}
  `
}

const formatReviews = (reviewForm, review = {}) => {
  const { choices, easSchemaID, questions } = reviewForm
  const { answers, attestationID, hypercertID, reviewer, name, summary } =
    review

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
    attestationID,
    questions: values,
  }
}

module.exports = {
  formatReviews,
  reviewToHtml,
}
