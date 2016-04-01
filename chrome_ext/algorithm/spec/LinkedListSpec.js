console.log(
  'Linked List tests',
  '\n',

  typeof Link === 'function',
  ' : The Link constructor should be a function',
  '\n',

  (new Link()) instanceof Link,
  ' : A link should be an instance of the Link constructor',
  '\n',

  (new Link('myData')).data === 'myData',
  ' : A link should have a data property equal to the data passed in on instantiation',
  '\n',

  typeof LinkedList === 'function',
  ' : The LinkedList constructor should be a function',
  '\n',

  (new LinkedList()) instanceof LinkedList,
  ' : A linked-list should be an instance of the LinkedList constructor',
  '\n',

  (function () {
    var list = new LinkedList();
    list.push(new Link(true));
    list.push(new Link(false));
    return list.head.data === true && list.tail.data === false;
  })(),
  ' : the push method shoud add a link to the end of the linked-list',
  '\n',

  (function () {
    var list = new LinkedList();
    list.unshift(new Link(true));
    list.unshift(new Link(false));
    return list.head.data === false && list.tail.data === true;   
  })(),
  ' : the unshift method shoud add a link to the front of the linked-list',
  '\n',

  (function () {
    var list = new LinkedList();
    list.push(new Link(true));list.push(new Link(false));
    return list.pop().data === false && list.pop().data === true && list.pop() === null;
  })(),
  ' : the pop method should remove a link from the end of the linked-list. A pop on an empty list should return null.',
  '\n',

  (function () {
    var list = new LinkedList();
    list.push(new Link(true));list.push(new Link(false));
    return list.shift().data === true && list.shift().data === false && list.shift() === null;
  })(),
  ' : the shift method should remove a link from the front of the linked-list. A shift on an empty list should return null.',
  '\n',

  (function () {
    var list = new LinkedList();
    var errorOccured = [false, false];
    try {
      list.push('not a link');
    } catch (error) {
      errorOccured[0] = true
    }
    try {
      list.unshift('not a link');
    } catch (error) {
      errorOccured[1] = true
    } 
    return errorOccured.every(function (val) {return val === true;});
  })(),
  ' : the linked-list should throw an error when pushing or unshifting something that is not a link',
  '\n',


  'end'
);