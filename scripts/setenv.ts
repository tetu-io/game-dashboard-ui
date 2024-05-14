// @ts-nocheck
const { writeFile, writeFileSync, readFileSync, open, existsSync, mkdirSync } = require('fs');
const { load, dump } = require('js-yaml');

const { argv } = require('yargs');
require('dotenv').config();

const envKey = 'SACRA_';
const envSubgraphUri = envKey + 'FANTOM_GAME_SUBGRAPH';
const { configuration } = argv;
const isProduction = configuration === 'prod';
const targetPath = isProduction ? `./src/environments/environment.prod.ts` : `./src/environments/environment.ts`;
const targetPath2 = !isProduction ? `./src/environments/environment.prod.ts` : `./src/environments/environment.ts`;
const gqlPath = './gql/.graphqlconfig';
const gqlCodegenPath = './gql/codegen.yml';

// @ts-ignore
const env = Object.keys(process.env)
  .filter(key => {
    return key.startsWith(envKey);
  })
  .reduce((result: any, key: string) => {
    result[key.replace(envKey, '')] = JSON.stringify(process.env[key]);

    return result;
  }, {});

/* Update GQL url path from env */
let gqlContent = JSON.parse(readFileSync(gqlPath, 'utf8'));
gqlContent.extensions.endpoints['Default GraphQL Endpoint'].url = process.env[envSubgraphUri];
writeFileSync(gqlPath, JSON.stringify(gqlContent));

/* Update GQL Codegen url */
let doc = load(readFileSync(gqlCodegenPath, 'utf-8'));
doc.schema = process.env[envSubgraphUri];
writeFileSync(gqlCodegenPath, dump(doc));

/* Update Angular envs from env */
let environmentFileContent = `export const environment = {
  production: ${isProduction},`;

Object.keys(env).forEach(key => {
  environmentFileContent = `${environmentFileContent}
  ${key}: ${env[key]},`;
});

environmentFileContent = `${environmentFileContent}
};
`;

if (!existsSync('./src/environments')) {
  mkdirSync('./src/environments');
}

open(targetPath, 'w', function (err, file) {
  if (err) {
    throw err;
  }
  console.log('Created: ' + targetPath);
});

open(targetPath2, 'w', function (err, file) {
  if (err) {
    throw err;
  }
  console.log('Created2: ' + targetPath2);
});

writeFile(targetPath, environmentFileContent, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});

writeFile(targetPath2, environmentFileContent, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath2}`);
});
