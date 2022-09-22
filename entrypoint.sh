#!/bin/sh -l

cd ..; ls
cd ../..; ls
cd ../../..; ls

node index.js \
  --r "${REPOSITORY_FULL_NAME}" \
  --m "${PR_DEPLOY_LABEL}" \
  --mb "${MAIN_BRANCH_NAME}" \
  --graph
