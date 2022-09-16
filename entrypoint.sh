#!/bin/sh -l

echo "Hello world!"
echo "${REPOSITORY_FULL_NAME}"
echo "${PR_DEPLOY_LABEL}"
echo "${MAIN_BRANCH_NAME}"

git branch
