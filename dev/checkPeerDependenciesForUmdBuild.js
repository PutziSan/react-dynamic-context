export const checkPeerDependenciesForUmdBuild = (
  peerDependencies,
  externals,
  globals
) => {
  const peerDepPackages = Object.keys(peerDependencies);

  const missingExternals = peerDepPackages.filter(
    peerDep => externals.indexOf(peerDep) < 0
  );

  if (missingExternals.length > 0) {
    throw new Error(
      `Following peer-dependencies are not marked as externals: ${missingExternals.join(
        ','
      )}. Please add it to the list, otherwise this library would be added to your bundle. Also make sure you add the PeerDependencies to the output.globals-Object (https://rollupjs.org/guide/en#output-globals-g-globals).`
    );
  }

  const missingGlobals = peerDepPackages.filter(peerDep => !globals[peerDep]);

  if (missingGlobals.length > 0) {
    throw new Error(
      `Following peer-dependencies are not listed in the output.globals-Object (https://rollupjs.org/guide/en#output-globals-g-globals): ${missingGlobals.join(
        ','
      )}. For your UMD bundle, you must specify for all PeerDependencies under which global variable the packages are found in UMD (in most cases this is the package-name PascalCased)`
    );
  }
};
