currentBranch=$(git branch --show-current)
echo "Current Branch: $currentBranch"

if [ "$currentBranch" != "deployment" ]; then
    echo "Invalid branch checked out for this deployment"
    
fi

git fetch

local=$(git rev-parse "$currentBranch")
remote=$(git rev-parse "origin/$currentBranch")

echo "Local: $local"
echo "Remote: $remote"

if [ "$local" != "$remote" ]; then
    echo "Make sure your local branch that has been selected for deployment is the same as the remote branch."
    
fi

npm install
npm run build 

aws s3 sync --profile hurcle-platform-frontend ./dist s3://hurcle-platform-frontend
aws cloudfront create-invalidation --profile hurcle-platform-frontend --distribution-id EZZLSFYADLTEC --paths "/*"
