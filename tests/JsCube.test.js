const JsCube = require('../src/JsCube');

describe('JsCube', () => {
    test('loads response JSON', () => {
        let response = require('./fixtures/cat-x-cat.json');
        let cube = new JsCube(response);
        expect(cube.result.counts).toEqual([5, 3, 2, 0, 5, 2, 3, 0, 0, 0, 0, 0]);
    });
});
