import { StreamParser } from 'n3';
import { arrayifyStream } from 'arrayify-stream';
import { default as streamify } from 'streamify-string';

// Implements the IParser interface from rdf-test-suite
// https://github.com/rubensworks/rdf-test-suite.js/blob/master/lib/testcase/rdfsyntax/IParser.ts
export function parse(data, baseIRI, options) {
  return arrayifyStream(streamify(data).pipe(
    new StreamParser(Object.assign({ baseIRI: baseIRI }, options))));
}
