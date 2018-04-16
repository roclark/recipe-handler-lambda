# Recipe Handler for AWS Lambda
An AWS Lambda function designed to read recipes from an S3 bucket and interact
with Amazon Alexa devices.

## Description
This project is designed to hook with an Amazon Alexa skill which supports all
Amazon Echo devices including the Echo Show. The skill is a recipe book that
interacts with the user by sharing recipes stored in the cloud in an AWS S3
instance via AWS Lambda.

This Lambda function code acts as a middle-ground between the Alexa skill and
the S3 bucket. For example, you can tell Alexa to do the following:
```
Alexa, ask "my recipe helper" to list my recipes
```
The Alexa skill will be called and determine which `intent` was spoken and run
our Lambda function, such as `ListRecipes`. The Lambda function is connected to
our Alexa skill via the application ID we include with the code. When the Lambda
function is notified that it needs to run, it checks which intent was used and
sees if any extra attributes were passed, such as a name of a food or number of
servings, depending on the specific intent.

In the example command you spoke above, the code reads all files in the
specified AWS S3 bucket and saves the recipe titles in a list to be orated to
the user on the Echo device the command was spoken to. If the device supports
displays, it will show a picture of the recipe if applicable as well as all
available information, including directions and ingredients, for the user to
easily go back and check steps.

## Usage
To get started using this code in an AWS Lambda function, run the following:
```
git clone https://github.com/roclark/recipe-handler-lambda
cd recipe-handler-lambda
```

If you don't have Node.js installed, you will need to install it by running the
following:
```
# For CentOS/RHEL and Fedora:
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
sudo yum install nodejs

# For Ubuntu:
sudo apt-get update
sudo apt-get install nodejs
```

Verify both Node.js and the Node Package Manager (`npm`) are installed:
```
$ node -v
v9.4.0
$ npm -v
5.6.0
```

To easily deploy code to an AWS Lambda function, four files are required to be
created in the cloned repositories root directory: `.application_id`,
`.access_key`, `.bucket`, and `.secret`. In each file, place just the string of
the specified value in the contents. For example, if you have an S3 bucket named
`my-s3-bucket-name`, you will save your `.bucket` file with exactly the
following contents:
```
my-s3-bucket-name
```

Complete this process for the Alexa Skill's Application ID in `.application_id`,
and your AWS access key and secret in `.access_key` and `.secret`, respectively.

These files are provided for your convenience and security so you don't
accidently commit code with any of these values. The `create-zip` script creates
a `recipe-handler-lambda.zip` file with all of the necessary credentials for the
code to run properly in the AWS Lambda function. To automatically create the
.zip file, run the `create-zip` script as follows (make sure you have created
the four crediental files listed above prior to running this step!):
```
./create-zip
```

The `recipe-handler-lambda.zip` function will be saved in the project's root
directory.

## Testing
To run unit tests against the code, first install all node.js packages specified
in the `package.json` file:
```
npm install
```

Next, run the included unit tests:
```
npm test
```

If the tests were successful, Mocha (the testing framework used in this project)
should output text only in green and white (ie. no red) and indicate all tests
are passing. If you find at any time that tests aren't passing, be sure to
create an issue in the repository to get it resolved.
