import 'angular-mocks';
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import todosList from '../todosList';
import {Tasks} from '../../../api/tasks';

const assert = require('chai').assert;

describe('todosList', () => {
    let element;
    let scope;

    beforeEach(() => {
        let $compile;
        let $rootScope;
        //let stateParams;
        window.module(todosList.name);

        /*stateParams = function() {
            this.$get = function() {
              return {something: false};
            };
        };

        let state = function () {
            this.$get = function() {
                return {};
            }
        }

        beforeEach(window.module(function($provide) {
            //$provide.provider('$stateParams', stateParams);
            //$provide.provider('$state', state);
        }));
        */

        inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        scope = $rootScope.$new();
        element = $compile('<todos-list></todos-list>')(scope);
        $rootScope.$digest();
    });

    describe('component', () => {
        it('should be showing incomplete tasks count', () => {
            assert.include(element[0].querySelector('h1').innerHTML, '0');
        });
    });

    describe('controller', () => {
        let controller;
        let userId = Random.id();

        beforeEach(() => {
            controller = element.controller('todosList');
        });

        describe('addTask', () => {
            let newTask = 'Be more fabolous';

            beforeEach(() => {
                sinon.stub(Meteor, 'call');
                controller.newTask = 'Be fabolous';
                controller.addTask(newTask);
            });

            afterEach(() => {
                Meteor.call.restore();
            });

            it('should call tasks.insert method', () => {
                sinon.assert.calledOnce(Meteor.call);
                sinon.assert.calledWith(Meteor.call, 'tasks.insert', newTask);
            });

            it('should reset newTask', () => {
                assert.equal(controller.newTask, '');
            });
        });

        describe('setChecked', () => {
            let taskId;

            beforeEach(() => {
                sinon.stub(Meteor, 'call');
                /*taskId = Tasks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'tmeasday',
                });*/
                //taskId = 'ErbwLdNLis5AtP3n4';
                controller.setChecked(taskId);
            });

            afterEach(() => {
                Meteor.call.restore();
            });

           /* it('should set task checked', () => {
                sinon.assert.calledOnce(Meteor.call);
                sinon.assert.calledWith(Meteor.call, 'tasks.setChecked', taskId, true);
            });*/

            it('should set task un-checked', () => {
                sinon.assert.calledOnce(Meteor.call);
                sinon.assert.calledWith(Meteor.call, 'tasks.setChecked', taskId, false);
            });
        });
    });
});