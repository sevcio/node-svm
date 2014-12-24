'use strict';

var assert = require('assert'),
    expect = require('expect.js'),
    Q = require('q'),
    mout = require('mout'),
    svmTypes = require('../../lib/core/svm-types'),
    evaluators = require('../../lib/evaluators'),
    regression = evaluators.regression;

var testSet = [
    [[0, 0, 0], '0'],
    [[0, 0, 1], '1'],
    [[0, 1, 0], '2'],
    [[0, 1, 1], '3'],
    [[1, 0, 0], '0'],
    [[1, 0, 1], '1'],
    [[1, 1, 0], '2'],
    [[1, 1, 1], '3']
];


describe ('Regression Evaluator', function(){
    it('should be default classifier for EPSILON_SVR', function () {
        expect(evaluators.getDefault({ svmType: svmTypes.EPSILON_SVR })).to.be(regression);
    });
    it('should be default classifier for NU_SVR', function () {
        expect(evaluators.getDefault({ svmType: svmTypes.NU_SVR })).to.be(regression);
    });
    describe ('with bad classifier', function () {
        var clf;
        beforeEach(function () {
            clf = { predictSync: function(state){ return'0'; } };
        });

        it ('should report a mse of 3.5', function(){
            var report = regression.evaluate(testSet, clf);
            expect(report.mse).to.be(3.5);
            expect(report).to.have.property('mean');
            expect(report).to.have.property('std');
            expect(report.size).to.be(8);
        });

    });

    describe ('with perfect classifier', function(){
        var clf;
        beforeEach(function () {
            clf = {
                predictSync: function(state){
                    return [['0', '1'], ['2', '3']][state[1]][state[2]];
                }
            };
        });

        it ('should report a mse/std error/mean errror of 0', function(){
            var report = regression.evaluate(testSet, clf);
            expect(report.mse).to.be(0);
            expect(report.std).to.be(0);
            expect(report.size).to.be(8);
        });
    });
});
