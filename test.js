// script.mjs

import simpleGit from 'simple-git';
import fetch from 'node-fetch';
import { Octokit } from '@octokit/rest';
import { promises as fs } from 'fs';
import path from 'path';
import env from './config.js'; // Adjust the path to your config file if needed

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
    console.log({first:env.githubToken})
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

    if (repoData) {
      console.log(`GitHub repository '${repoName}' already exists.`);
    } else {
      // Create the GitHub repository if it doesn't exist
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: false, // You can set this to true if you want a private repo
      });

      console.log(`GitHub repository '${repoName}' created.`);
    }

    // Check if the directory already exists
    let directoryExists = true;
    try {
      await fs.access(repoPath);
    } catch (err) {
      // Directory does not exist, create it
      await fs.mkdir(repoPath);
      directoryExists = false;
    }

    if (directoryExists) {
      console.log(`Directory '${repoName}' already exists.`);
    } else {
      console.log(`Directory '${repoName}' created.`);
    }

    // Initialize a new Git repository if it doesn't exist
    if (!directoryExists) {
      await simpleGit().init(); // Initialize Git in the current directory
    }

    // Create or modify a file (for demonstration)
    await fs.writeFile(path.join(repoPath, 'example.txt'), 'Hello, GitHub!');

    // Add and commit changes
    const git = simpleGit();
    await git.add('./*');
    await git.commit('Daily commit');

    // Check if the remote "origin" already exists
    const remoteExists = await git.checkIsRepo('isRepo', 'origin');

    if (!remoteExists) {
      // If the remote "origin" doesn't exist, add it
      const remoteUrl = `https://github.com/${env.githubUserName}/${repoName}.git`;
      await git.addRemote('origin', remoteUrl);
    } else {
      // If the remote "origin" exists, update its URL
      const remoteUrl = `https://github.com/${env.githubUserName}/${repoName}.git`;
      await git.removeRemote('origin');
      await git.addRemote('origin', remoteUrl);
    }

    // Push changes to GitHub
    await git.push(['-u', 'origin', 'main']); // Assuming you want to push to the 'main' branch

    console.log('All operations completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

createGitHubRepoAndAddCommitPush();
