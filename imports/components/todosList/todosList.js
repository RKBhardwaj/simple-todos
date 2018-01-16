import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '../../api/tasks.js';

import template from './todosList.html';

class TodosListCtrl {
    constructor($scope) {
        /*this.tasks = [{
            text: 'This is task 1'
        }, {
            text: 'This is task 2'
        }, {
            text: 'This is task 3'
        }];*/
        //this.stateParams = $stateParams;
        //this.stateParams.something = true;
        $scope.viewModel(this);

        this.subscribe('tasks'); //Subscribing to the tasks collection

        this.hideCompleted = false;

        this.helpers({
            tasks() {

                const selector = {};

                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }

                // Show newest tasks at the top using -1 in the sort argument for date field
                return Tasks.find(selector, {
                    sort: {
                        createdAt: -1
                    }
                });
            },
            incompleteCount() {
                return Tasks.find({
                    checked: {
                        $ne: true
                    }
                }).count();
            },
            currentUser() {
                return Meteor.user();
            }
        })
    }

    addTask(newTask) {
        // Insert a task into the collection
        //Commenting this code as database handiling will be done from server end.
        /*Tasks.insert({
          text: newTask,
          createdAt: new Date,
          owner: Meteor.userId(),
          username: Meteor.user().username
        });*/

        Meteor.call('tasks.insert', newTask);

        // Clear form
        this.newTask = '';
    }

    setChecked(task) {
        // Set the checked property to the opposite of its current value
        //Commenting below code as database handiling will be done from server end.
        /*Tasks.update(task._id, {
          $set: {
            checked: !task.checked
          },
        });*/
        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }

    removeTask(task) {
        //remove the task from the database
        //Commenting below code as database handiling will be done from server end.
        //Tasks.remove(task._id);

        Meteor.call('tasks.remove', task._id);
    }

    setPrivate(task) {
        Meteor.call('tasks.setPrivate', task._id, !task.private);
    }
}

export default angular.module('todosList', [
    angularMeteor
])
    .component('todosList', {
        templateUrl: template,
        controller: ['$scope', TodosListCtrl]
    });