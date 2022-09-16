#!/bin/sh -l

echo "Hello world!"
echo "${REPOSITORY_FULL_NAME}"
echo "${PR_DEPLOY_LABEL}"
echo "${MAIN_BRANCH_NAME}"

node index.js \
  --r "${REPOSITORY_FULL_NAME}" \
  --m "${PR_DEPLOY_LABEL}" \
  --mb "${MAIN_BRANCH_NAME}" \
  --graph

ls
