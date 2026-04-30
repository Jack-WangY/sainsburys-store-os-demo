#!/bin/bash

# Create a backup branch to preserve the current state with chapter 2
cd /vercel/share/v0-project

# Create and push the backup branch
git checkout -b backup/with-tommoe-chapter2
git push origin backup/with-tommoe-chapter2

# Switch back to the original branch
git checkout main

echo "Backup branch 'backup/with-tommoe-chapter2' created and pushed successfully!"
