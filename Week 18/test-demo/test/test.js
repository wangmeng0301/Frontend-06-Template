var assert = require('assert');

// import { add } from '../add';
// var add = require('../add').add;
// var mul = require('../add').mul;

import {add, mul} from '../add';

describe('add function testing', function () {
  it('1 + 2 shoule be 3', function() {
    assert.equal(add(1, 2), 3);
  });
  it('-1 + 2 shoule be -3', function() {
    assert.equal(add(-5, 2), -3);
  });
  it('-5 * 2 shoule be -10', function() {
    assert.equal(mul(-5, 2), -10);
  });
})