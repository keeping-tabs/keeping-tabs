var listeners = require('./algorithm/listeners.js');
/* globals $: false */
$(function(){
  /* globals chrome: false, ENV: false */
  console.log('Service Initialized');
  listeners.init();
});