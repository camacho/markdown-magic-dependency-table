import fs from 'fs';
import path from 'path';
import { findUpSync } from 'find-up';
import semver from 'semver';

const defaults = {
  optional: 'false',
  dev: 'false',
  peers: 'false',
  production: 'false',
};

const npmPkgUrl = 'https://npmjs.org/package/';

function findPkg(dir) {
  const pkgPath = findUpSync('package.json', { cwd: dir });
  if (!pkgPath) throw new Error('No package.json file found');
  return pkgPath;
}

function sanitizeSemver(version, maxLength = 10, truncateStr = '...') {
  if (semver.valid(version)) return version;
  return version.length > maxLength - truncateStr.length
    ? `${version.substr(0, maxLength - truncateStr.length)}${truncateStr}`
    : version;
}

function convertRepositoryToUrl(repository, name) {
  let repo = (repository.url || repository).replace('.git', '');

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

const readDependencies =
  (pkg, pkgDir) =>
  (manifest, dependencyType = 'production') => {
    let dependencies;

    if (dependencyType === 'production') {
      dependencies = pkg.dependencies;
    } else {
      dependencies = pkg[`${dependencyType}Dependencies`];
    }

    return manifest.concat(
      Object.keys(dependencies || {}).map((name) => {
        const localPkgPath = findUpSync(
          path.join('node_modules', name, 'package.json'),
          { cwd: pkgDir },
        );

        if (!localPkgPath) {
          return {
            name,
            semver: sanitizeSemver(dependencies[name]),
            version: '-',
            description: '-',
            url: getPkgUrl({ name }),
            license: '-',
            dependencyType,
          };
        }

        const localPkg = JSON.parse(fs.readFileSync(localPkgPath, 'utf8'));
        const { description, homepage, version, repository, license } =
          localPkg;

        return {
          name,
          semver: sanitizeSemver(dependencies[name]),
          version,
          description,
          url: getPkgUrl(localPkg),
          license: license ?? 'UNLICENSED',
          dependencyType,
        };
      }),
    );
  };

function renderDependencies(dependency) {
  const { name, semver, version, license, description, url, dependencyType } =
    dependency;
  return [
    '',
    `[${[name, semver].join('@')}](${url})`,
    description,
    version,
    license,
    dependencyType,
    '',
  ].join(' | ');
}

export default function DEPENDENCYTABLE({ content, options = {}, srcPath }) {
  const opts = Object.assign({}, defaults, options);

  let pkgPath;

  if (opts.pkg) {
    pkgPath = path.resolve(path.dirname(srcPath), opts.pkg);
  } else {
    pkgPath = findPkg(srcPath);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const headers = [
    '| **Dependency** | **Description** | **Version** | **License** | **Type** |',
    '| -------------- | --------------- | ----------- | ----------- | -------- |',
  ];

  const types = ['production', 'peer', 'optional', 'dev'];

  // the public option is `peers`; the internal type key is `peer`
  const declaredTypes = types.filter(
    (type) => opts[type === 'peer' ? 'peers' : type] === 'true',
  );

  const deps = (declaredTypes.length ? declaredTypes : types)
    .reduce(readDependencies(pkg, path.dirname(pkgPath)), [])
    .map(renderDependencies);

  return headers.concat(deps).join('\n');
}
