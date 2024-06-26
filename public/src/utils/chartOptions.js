export const getRatingsData = (ratings) => {
  // Calculate the count of each rating star
  const starCount = ratings.reduce((acc, rating) => {
    acc[rating.star] = (acc[rating.star] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(starCount).map((star) => `Rating ${star} stars`),
    datasets: [
      {
        label: "Number of Ratings",
        data: Object.values(starCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
};

export const getSentimentsData = (ratings) => {
  // Calculate the count of each sentiment
  const sentimentCount = ratings.reduce((acc, rating) => {
    const sentiment = rating.sentiment; // Assuming each rating has a sentiment property
    if (sentiment === "positive") acc.positive += 1;
    else if (sentiment === "negative") acc.negative += 1;
    return acc;
  }, { positive: 0, negative: 0 });

  return {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        label: "Sentiment Ratio",
        data: [sentimentCount.positive, sentimentCount.negative],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
};
