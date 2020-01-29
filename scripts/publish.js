const execSync = require('child_process').execSync;

const version = process.env.npm_package_config_version; //process.argv[2];

console.log(version);

if (version) {

    const publishScript=`lerna publish --skip-git --repo-version=${version}`;

    execSync(
        publishScript, {stdio: 'inherit'}
    );
} else {
    console.log('Must specific publish version like: npm run publish 9.9.9');
}
