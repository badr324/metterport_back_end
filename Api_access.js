const axios = require("axios");
require("dotenv").config();

// Your Matterport API credentials
const tokenID = process.env.TOKEN_ID;
const tokenSecret = process.env.TOKEN_SECRET;

// Authorization header value
const authHeaderValue = `Basic ${Buffer.from(
  `${tokenID}:${tokenSecret}`
).toString("base64")}`;

// GraphQL query
const graphqlQuery = `
{
    models(query: "*") {
        totalResults
        results {
            id
            name
            created
        }
    }
}
`;

// Function to fetch models using GraphQL
async function fetchModels() {
  try {
    const response = await axios.post(
      "https://api.matterport.com/api/models/graph",
      {
        query: graphqlQuery,
      },
      {
        headers: {
          Authorization: authHeaderValue,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching models:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

exports.getModels = async () => {
  const {
    data: { models },
  } = await fetchModels();
  return models.results;
};
