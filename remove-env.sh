#!/bin/bash

# Get a list of all branches
branches=$(git branch -r | grep -v '\->' | sed 's/origin\///')

# Loop through each branch and remove the .env file from tracking
for branch in $branches; do
    echo "Processing branch: $branch"
    git checkout $branch
    git rm --cached .env
    echo ".env" >>.gitignore
    git add .gitignore
    git commit -m "Remove .env file from tracking and add to .gitignore"
    git push origin $branch
done

# Switch back to master branch
git checkout master
