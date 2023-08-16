# deresy-api

## Cloud Functions

### Project setup
Navigate to `functions` folder and run
```
yarn install
or
cd functions && yarn install
```

### Run functions locally
To test your cloud functions locally against development project run
```
yarn serve
```

### Deploy cloud functions
* Login to firebase cli
```
firebase login
``` 
* If you are already logged in, the firebase cli will return current account, if it is not the correct one, you need to log out first
```
firbase logout
```

* Run the corresponding script according to the environment you want to deploy
```
yarn deploy:functions:dev
yarn deploy:functions:staging
yarn deploy:functions:prod
```

## Cloud firestore rules
### Deploy firestore rules
* Login to firebase cli. See above commands.
* Run the corresponding script according to the environment you want to deploy
```
yarn deploy:rules:dev
yarn deploy:rules:staging
yarn deploy:rules:prod
```
## Grants
### Add Grants firestore
* Create an env var called GOOGLE_APPLICATION_CREDENTIALS and point it to your Firebase Service Account private key
```
GOOGLE_APPLICATION_CREDENTIALS="path_to_your_private_key"
```
* Add the desired grants ids to the grants.txt file located in the scripts folder
* Run 
```
yarn grants:add 
```