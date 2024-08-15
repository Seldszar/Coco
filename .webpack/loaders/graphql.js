const { createHash } = require("crypto");
const { parse, stripIgnoredCharacters } = require("graphql");

function getOperationName(document) {
  for (const node of document.definitions) {
    if (node.kind === "OperationDefinition") {
      return node.name ? node.name.value : undefined;
    }
  }
}

function getSha256Hash(query) {
  return createHash("sha256").update(query).digest("hex");
}

module.exports = function loader(query) {
  query = stripIgnoredCharacters(query);

  const document = parse(query);

  const operationName = getOperationName(document);
  const sha256Hash = getSha256Hash(query);

  return `module.exports = ${JSON.stringify({ operationName, query, extensions: { persistedQuery: { sha256Hash, version: 1 } } })}`;
}
