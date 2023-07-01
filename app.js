require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");

// Set AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1",
});

// Create an instance of the AWS Secrets Manager
const secretsManager = new AWS.SecretsManager();

// Function to retrieve the secret value
async function getSecretValue(secretName) {
  try {
    const params = {
      SecretId: secretName,
    };
    const response = await secretsManager.getSecretValue(params).promise();
    return JSON.parse(response.SecretString);
  } catch (err) {
    console.error("Error retrieving secret:", err);
    throw err;
  }
}

// Usage example
const secretName = "dev/demo";

getSecretValue(secretName)
  .then((secretValue) => {
    console.log(secretValue.DATABASE);
    console.log("Secret value:", secretValue);
    // Use the secret value as needed
  })
  .catch((err) => {
    console.error("Error:", err);
  });

// routes
const baseRoutes = require("./routes/base-route");
const app = express();

app.use(express.json());
app.use(baseRoutes);

app.listen(process.env.APP_PORT ? process.env.APP_PORT : 3000);
console.log(
  `server is running on http://localhost:${
    process.env.APP_PORT ? process.env.APP_PORT : 3000
  }`
);
