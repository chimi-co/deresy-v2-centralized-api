const formatReviews = (reviewForm, review = {}) => {
  const { choices, easSchemaID, questions } = reviewForm
  const { answers, attestationID, hypercertID, reviewer } = review

  const values = questions.map((question, index) => {
    return {
      question,
      choices: choices[index].choices,
      answer: answers[index],
    }
  })

  // Hardcoded name and summary info of the Grant
  const name = 'Digital Gaia: High-Integrity Impact Certificates for ReFi'
  const summary =
    'Digital Gaia aims to revolutionize climate impact integrity by creating a decentralized, data-driven, open-source model for certifying environmental projects using AI and blockchain.'

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
}
