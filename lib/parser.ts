import { StreamParser, type StreamParserOptions } from 'n3';
import { arrayifyStream } from 'arrayify-stream';
import { default as streamify } from 'streamify-string';
import type * as RDF from '@rdfjs/types';
import { write } from '@jeswr/pretty-turtle';
import { isomorphic } from 'rdf-isomorphic';

// Implements the IParser interface from rdf-test-suite
// https://github.com/rubensworks/rdf-test-suite.js/blob/master/lib/testcase/rdfsyntax/IParser.ts
export function iparse(data: string, baseIRI: string, options: StreamParserOptions) {
  return arrayifyStream(streamify(data).pipe(
    new StreamParser(Object.assign({ baseIRI: baseIRI }, options))));
}

export async function parse(data: string, baseIRI: string, options: StreamParserOptions) {
  const quads = await iparse(data, baseIRI, options);
  const ser = await serialize(quads, baseIRI, { format: 'turtle' });
  let parsed: RDF.Quad[];
  // We need to parse the serialized data again to check if it is isomorphic
  try {
    parsed = await iparse(ser, baseIRI, options);
  } catch (e) {
    throw new Error(`Error parsing serialized data: ${e}\n The serialized data is: ${ser}`);
  }
  if (!isomorphic(quads, parsed)) {
    throw new Error('Parsed quads are not isomorphic to original quads');
  }
  return parsed;
}

export function serialize(data: RDF.Quad[], baseIRI: string, options: {format: string}) {
  if (options.format !== 'turtle') {
    throw new Error(`Unsupported format: ${options.format}`);
  }

  return write(data, {
    format: 'text/turtle',
  })
}
