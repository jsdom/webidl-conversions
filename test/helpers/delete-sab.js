"use strict";
// This file is meant to be used with the --require option to Mocha to run the test suite without SharedArrayBuffer
// support. This ensures we continue to work in environments, like browsers without cross-origin isolation headers,
// that lack SharedArrayBuffer.

delete global.SharedArrayBuffer;
