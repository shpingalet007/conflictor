#!/bin/bash

# declare -A pull_conflicts

echo "WORKING DIRECTORY IS"
pwd

pulls=("$@")

git fetch --all > /dev/null 2>&1

if [ -z "$CONFLICTOR_MASTER_SHA" ]; then
  masterSha="$(git rev-parse origin/$CONFLICTOR_MAIN_BRANCH)"
else
  masterSha=$CONFLICTOR_MASTER_SHA
fi

pulls+=($masterSha)

echo ">>> MASTER BRANCH SHA [$masterSha]"

if [[ "${#pulls[@]}" -lt 2 ]]; then
  echo ">>> ERROR [NOT ENOUGH ARGUMENTS]"
fi

for i in "${!pulls[@]}"; do
  if [[ $i -eq ${#pulls[@]}-1 ]]
  then
    break
  fi

  git checkout ${pulls[$i]} > /dev/null 2>&1

  # echo "------------------------------------"
  # echo "ANALYZING PULL REQUEST $i"
  # echo "------------------------------------"
  # echo "DIRECTLY CHANGED FILES"
  # echo "------------------------------------"

  echo ">>> DIRECT IMPACT INSPECTION [$i] - START"
  git --no-pager log --raw --first-parent --oneline --no-merges origin/$CONFLICTOR_MAIN_BRANCH..HEAD | grep '^:' | cut -f2-
  echo ">>> END"

  # git --no-pager log --raw --oneline --no-merges origin/$CONFLICTOR_MAIN_BRANCH..HEAD | grep '^:' | cut -c38-

  for j in "${!pulls[@]}"; do
    if [[ $j -le $i ]]
    then
      continue
    fi

    # echo "CONFLICTS BETWEEN PULL REQUEST $i AND $j"
    # echo "------------------------------------"
    # echo "CONFLICTS GROUP [$i:$j]"

    git merge --no-commit ${pulls[$i]} ${pulls[$j]} > /dev/null 2>&1

    echo ">>> SIDE IMPACT INSPECTION [$i:$j] - START"
    git --no-pager diff --name-status --diff-filter=U | cut -c3-
    echo ">>> END"

    git reset --hard HEAD~1 > /dev/null 2>&1
    git clean -xxdf > /dev/null 2>&1

    git checkout origin/$CONFLICTOR_MAIN_BRANCH > /dev/null 2>&1
  done
done
