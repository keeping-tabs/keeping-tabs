$(function () {
   
    'use strict';
    
    $('#louisButton').click(function () {
        $('#louisCard').toggleClass('on');
        $('.add i').toggleClass('fa-minus');
    });

    $('#justinButton').click(function () {
        $('#justinCard').toggleClass('on');
        $('.add i').toggleClass('fa-minus');
    });

    $('#jakeButton').click(function () {
        $('#jakeCard').toggleClass('on');
        $('.add i').toggleClass('fa-minus');
    });

    $('#ivanButton').click(function () {
        $('#ivanCard').toggleClass('on');
        $('.add i').toggleClass('fa-minus');
    });
});