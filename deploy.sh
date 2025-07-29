currentBranch=$(git branch --show-current);
echo "Current Branch: $currentBranch";
if [ $currentBranch != "main" ]
then
    echo "Invalid branch checked out for this deployment"
    exit 2;
fi
git fetch
local=$(git rev-parse $currentBranch);
remote=$(git rev-parse origin/$currentBranch);
echo "Local: $local";
echo "Remote: $remote";
if [ $local != $remote ]
then
    echo "Make sure your local branch that has been selected for deployment is the same as the remote branch."
    exit 2;
fi
cp envs/.env.prod .env
npm install
npm run build
aws s3 sync  --profile ir-hr-portal ./dist s3://irsolutions-hr-portal
aws cloudfront create-invalidation --profile ir-hr-portal --distribution-id E33H1EGKAVGN51 --paths "/*"
cp envs/.env.local .env