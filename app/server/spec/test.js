var foo = 'bar';
var tea = {
	flavors:['mocha', 'chai', 'coffee']
};

var chai = require('chai');
var assert = require('assert');

describe('Example Tests', function () {
  it('should equal 2 in just plain mocha', function () {
    assert.equal(2, 1 + 1);
  });
  it('An example of using chai should', function () {
    chai.should();
		foo.should.be.a('string');
		foo.should.equal('bar');
		foo.should.have.length(3);
		tea.should.have.property('flavors')
		  .with.length(3);
  });
  it('An example of using chai expect', function () {
		var expect = chai.expect;

		expect(foo).to.be.a('string');
		expect(foo).to.equal('bar');
		expect(foo).to.have.length(3);
		expect(tea).to.have.property('flavors')
		  .with.length(3);
  });
  it('An example of using chai assert', function () {
		var assert = chai.assert;

		assert.typeOf(foo, 'string');
		assert.equal(foo, 'bar');
		assert.lengthOf(foo, 3)
		assert.property(tea, 'flavors');
		assert.lengthOf(tea.flavors, 3);
  });
});