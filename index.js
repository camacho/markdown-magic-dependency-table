const fs = require('fs');
const path = require('path');
const findup = require('findup');
const getInstalledPath = require('get-installed-path');

const defaults = {
  optional: 'false',
  development: 'false',
  peers: 'false',
  production: 'true',
};

function findPkg(dir) {
  try {
    return path.join(findup.sync(dir, 'package.json'), 'package.json');
  } catch (err) {
    console.log(err);
    throw new Error('No package.json file found');
  }
}

const readDependencies = pkg => (manifest, type) => {
  const dependencyType = type || 'production';

  let dependencies;

  if (type === 'production') {
    dependencies = pkg.dependencies;
  } else {
    dependencies = pkg[`${type}Dependencies`];
  }

  return manifest.concat(
    Object.keys(dependencies || {}).map(name => {
      const localPkgPath = path.join(
        getInstalledPath.sync(name, { local: true }),
        'package.json'
      );

      const { description, homepage, version } = JSON.parse(
        fs.readFileSync(localPkgPath, 'utf8')
      );

      return {
        name,
        semver: dependencies[name],
        version,
        description,
        homepage: homepage || `https://www.npmjs.com/package/${name}`,
        dependencyType,
      };
    })
  );
};

function renderDependencies(dependency) {
  const {
    name,
    semver,
    version,
    description,
    homepage,
    dependencyType,
  } = dependency;

  return [
    '',
    `[${[name, semver].join('@')}](${homepage})`,
    description,
    version,
    dependencyType,
    '',
  ].join(' | ');
}

module.exports = function DEPENDENCYTABLE(content, _options = {}, config) {
  const options = Object.assign({}, defaults, _options);

  let pkgPath;

  if (options.pkg) {
    pkgPath = path.resolve(path.dirname(config.originalPath), options.pkg);
  } else {
    pkgPath = findPkg(config.originalPath);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const headers = [
    '| **Dependency** | **Description** | **Version** | **Type** |',
    '| -------------- | --------------- | ----------- | -------- |',
  ];

  const deps = ['production', 'peer', 'optional', 'dev']
    .filter(type => options[type] !== 'false')
    .concat([''])
    .reduce(readDependencies(pkg), [])
    .map(renderDependencies);

  return headers.concat(deps).join('\n');
};
