export const getRatingsData = (ratings) => ({
    labels: ratings.map((rating) => `Rating ${rating.star} stars`),
    datasets: [
      {
        label: "Number of Ratings",
        data: ratings.map((rating) => rating.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  
  export const getOnlineUsersData = (onlineUsers, totalUsers) => ({
    labels: ["Online Users", "Offline Users"],
    datasets: [
      {
        data: [onlineUsers.length, totalUsers - onlineUsers.length],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  });
  
  export const getConversationsData = (conversations) => ({
    labels: ["Conversations"],
    datasets: [
      {
        label: "Number of Conversations",
        data: [conversations.length],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  });
  