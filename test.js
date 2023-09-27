// script.mjs

import simpleGit from 'simple-git';
import fetch from 'node-fetch';
import { Octokit } from '@octokit/rest';
import { promises as fs } from 'fs';
import path from 'path';
import env from './config.js'; // Adjust the path to your config file if needed
import dotenv from 'dotenv'; // Import dotenv package

// Load environment variables from .env file
dotenv.config();

const repoName = 'my-test-automated-repo';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Use import.meta.url to get the current file's URL and convert it to a file path
const currentFilePath = fileURLToPath(import.meta.url);

// Use dirname to get the directory name
const currentDir = dirname(currentFilePath);

// Now, you can use currentDir in your path.join call
const repoPath = path.join(currentDir, repoName);

async function createGitHubRepoAndAddCommitPush() {
  try {
    const octokit = new Octokit({
      auth: env.githubToken,
      request: {
        fetch, // Pass fetch implementation
      },
    });

    // Check if the GitHub repository already exists
    const { data: repoData } = await octokit.repos.get({
      owner: env.githubUserName,
      repo: repoName,
    });

    if (!repoData) {
      // Create the GitHub repository if it doesn't exist
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: false, // You can set this to true if you want a private repo
      });

      console.log(`GitHub repository '${repoName}' created.`);
    }

    // Initialize a new Git repository if it doesn't exist
    if (!(await fs.stat(repoPath).catch(() => false))) {
      await simpleGit().init({ dir: repoPath }); // Initialize Git in the repoPath directory
      console.log(`Directory '${repoName}' created and Git initialized.`);
    }

    // Create or modify a file (for demonstration)
    await fs.writeFile(path.join(repoPath, 'example.txt'), `Hello, GitHub! ${new Date()}`);

    // Add and commit changes
    const git = simpleGit(repoPath);

    await git.add('../*');
    await git.commit(`Commit at ${new Date()}`); // Use a dynamic commit message

    // Push changes to GitHub
    await git.push(['-u', 'origin', 'main']); // Assuming you want to push to the 'main' branch

    console.log('All operations completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
} 

await createGitHubRepoAndAddCommitPush();
await createGitHubRepoAndAddCommitPush();
await createGitHubRepoAndAddCommitPush();
await createGitHubRepoAndAddCommitPush();
await createGitHubRepoAndAddCommitPush();
await createGitHubRepoAndAddCommitPush();

