if [ $NODE_ENV == 'dev' ] 
then
functionName=Dev_JobSquareAPIs_V3
elif [ $NODE_ENV == 'beta' ]
then
functionName=Beta_JobSquareAPIs_V3
elif [ $NODE_ENV == 'prod' ]
then
functionName=Prod_JobSquareAPIs_V3
else
echo "NODE_ENV=$NODE_ENV is neither prod or preview so existing"
exit
fi
echo "NODE_ENV=$NODE_ENV" 
echo "functionName=$functionName"
rm -rf ../lambda.zip
node build.js || { echo 'Build failed' ; exit 1; }
zip -r9 ../lambda.zip * -x "*.git*" -x "*.marko" -x "server.js" -x "*.sh" -x "assets*" -x "build.js"
cd ..
aws s3 cp lambda.zip s3://static.jobsquare.com/lambda.zip
aws lambda --region ap-south-1 update-function-code --s3-bucket static.jobsquare.com --s3-key lambda.zip --function-name $functionName
#aws lambda --region ap-south-1 update-function-code --zip-file fileb://lambda.zip  --function-name $functionName
cd -