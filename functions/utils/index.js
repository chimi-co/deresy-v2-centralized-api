const formatReviews = (reviewForm, review = {}) => {
  const { choices, easSchemaID, questions } = reviewForm;
  const { answers, attestationID, hypercertID, reviewer, name, summary } = review;

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
}
