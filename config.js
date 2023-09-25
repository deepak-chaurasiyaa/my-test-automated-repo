import dotenv from 'dotenv'
dotenv.config('.env')
export default {
  githubToken: process.env.GITHUB_TOKEN,
  githubUserName: process.env.GITHUB_USER_NAME,
};
