var Task = require('../models/models'); //created model loading here
const songController = require('./songController');

test('adds 1 + 2 to equal 3', () => {
    expect(songController.basic()).toBe('hi');
});