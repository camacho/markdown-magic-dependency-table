const fs = require('fs');
const path = require('path');
const findup = require('findup');
const semver = require('semver');
const getInstalledPath = require('get-installed-path');

const defaults = {
  optional: 'false',
  dev: 'false',
  peers: 'false',
  production: 'true',
};

const npmPkgUrl = 'https://npmjs.org/package/';

function findPkg(dir) {
  try {
    return path.join(findup.sync(dir, 'package.json'), 'package.json');
  } catch (err) {
    console.log(err);
    throw new Error('No package.json file found');
  }
}

function sanitizeSemver(version, maxLength = 10, truncateStr = '...') {
  if (semver.valid(version)) return version;

  const adjustedLength = maxLength - truncateStr.length;

  return version.length > adjustedLength
    ? [version.substr(0, adjustedLength), truncateStr].join('')
    : version;
}

function convertRepositoryToUrl(repository, name) {
  let repo = (repository.url ? repository.url : repository).replace('.git', '');

  if (repo.startsWith('http')) {
    return repo;
  } else if (repo.startsWith('git://')) {
    return repo.replace('git://', 'https://');
  } else if (repo.startsWith('git+ssh')) {
    const [full, url] = repo.match(/^git\+ssh\:\/\/git\@(.*)$/);
    return [`https://`, url].join('');
  } else if (repo.startsWith('git@')) {
    return repo.replace('git@', 'https://').replace(':', '/');
  } else {
    return ['https://github.com/', repo].join('');
  }

  return repo;
}

function getPkgUrl(pkg) {
  const { name, repository, homepage, bugs } = pkg;

  if (homepage) return homepage;
  if (repository) return convertRepositoryToUrl(repository, name);
  if (bugs) return bugs.url || bugs;
  return `https://npmjs.org/package/${name}`;
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

      const localPkg = JSON.parse(fs.readFileSync(localPkgPath, 'utf8'));

      const { description, homepage, version, repository, license } = localPkg;

      return {
        name,
        semver: sanitizeSemver(dependencies[name]),
        version,
        description,
        url: getPkgUrl(localPkg),
        dependencyType,
        license
      };
    })
  );
};

function convertLicenseToUrl(spdx) {
  if (spdx) {
    const url = `https://spdx.org/licenses/${spdx}.html`;
    return `[${spdx}](${url})`;
  }
  return 'None found'
}

function renderDependencies(dependency) {
  const {
    name,
    semver,
    version,
    description,
    url,
    dependencyType,
    license
  } = dependency;

  return [
    '',
    `[${[name, semver].join('@')}](${url})`,
    description,
    version,
    dependencyType,
    convertLicenseToUrl(license),
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
    '| **Dependency** | **Description** | **Version** | **Type** | **License** |',
    '| -------------- | --------------- | ----------- | -------- | -------- |',
  ];

  const deps = ['production', 'peer', 'optional', 'dev']
    .filter(type => options[type] !== 'false')
    .concat([''])
    .reduce(readDependencies(pkg), [])
    .map(renderDependencies);

  return headers.concat(deps).join('\n');
};
