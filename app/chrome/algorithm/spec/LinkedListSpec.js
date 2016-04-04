
var assert = chai.assert;
chai.should();
var expect = chai.expect;

describe('Link tests', function () {
  it('should be a constructor function', function () {
    assert.typeOf(Link, 'function');
  });
  it('new Link() should be an instance of the Link constructor', function () {
    ((new Link()) instanceof Link).should.equal(true);
  });
  it('should have a data property equal to the data passed in on instantiation', function () {
    (new Link('myData')).should.have.property('data').equal('myData');
  });
});

describe('Linked List tests', function () {
  it('The LinkedList constructor should be a function', function () {
    assert.typeOf(LinkedList, 'function');
  });
  it('new LinkList() should be an instance of the LinkList constructor', function () {
    ((new LinkedList()) instanceof LinkedList).should.equal(true);
  });
  it('should have a data property equal to the data passed in on instantiation', function () {
    (new Link('myData')).should.have.property('data').equal('myData');
  });
  it('the push method shoud add a link to the end of the linked-list', function () {
    var list = new LinkedList();
    list.push(new Link(true));
    list.push(new Link(false));
    (list.head.data).should.equal(true);
    (list.tail.data).should.equal(false);
  });
  it('the unshift method shoud add a link to the front of the linked-list', function () {
    var list = new LinkedList();
    list.unshift(new Link(true));
    list.unshift(new Link(false));
    (list.head.data).should.equal(false);
    (list.tail.data).should.equal(true); 
  });
  it('the pop method should remove a link from the end of the linked-list. A pop on an empty list should return null.', function () {
    var list = new LinkedList();
    list.push(new Link(true));
    list.push(new Link(false));
    (list.pop().data).should.equal(false);
    (list.pop().data).should.equal(true);
    assert.equal(list.pop(), null);
  });
  it('the shift method should remove a link from the front of the linked-list. A shift on an empty list should return null.', function () {
    var list = new LinkedList();
    list.push(new Link(true));
    list.push(new Link(false));
    (list.shift().data).should.equal(true);
    (list.shift().data).should.equal(false);
    assert.equal(list.shift(), null);    
  });
  it('the linked-list should throw an error when pushing or unshifting something that is not a link', function () {
    var list = new LinkedList();
    expect(function(){list.push('not a link')}).to.throw(Error);
  });
});
