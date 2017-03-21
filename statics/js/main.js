'use strict';

function operateFormatterTask(value, row, index) {
    return [
        '<a class="ananke-action-row icon-edit" id="edit-task" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-pencil"></i>',
        '</a>',
        '<a class="ananke-action-row icon-remove" id="remove-task" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-trash"></i>',
        '</a>'
    ].join('');
}

function operateFormatterSchedule(value, row, index) {
    return [
        '<a class="ananke-action-row icon-edit" id="edit-schedule" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-pencil"></i>',
        '</a>',
        '<a class="ananke-action-row icon-remove" id="remove-schedule" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-trash"></i>',
        '</a>'
    ].join('');
}

window.operateEvents = {
    'click #edit-task': function (e, value, row, index) {
        console.log(value, row, index);
    },
    'click #remove-task': function (e, value, row, index) {
        $.ajax({
            url: '/ajax/task/' + row.id,
            type: 'DELETE',
            success: function(result) {
                $('#tasks-table').bootstrapTable('refresh', {});
            }
        });
    },

    'click #edit-schedule': function (e, value, row, index) {
        console.log(value, row, index);
    },
    'click #remove-schedule': function (e, value, row, index) {
        $.ajax({
            url: '/ajax/schedule/' + row.id,
            type: 'DELETE',
            success: function(result) {
                $('#schedules-table').bootstrapTable('refresh', {});
            }
        });
    },
};

$(document).ready(function() {
    $('#add-new-task-button').on('click', function() {
        window.location = '/task/add';
    });

    $('#add-new-schedule-button').on('click', function() {
        window.location = '/schedule/add';
    });

    $('#task-edit-submit').on('click', function() {
        let body = {};

        body.name = $('#task-name').val();
        body.desc = $('#task-desc').val();
        body.schedule_id = $('#task-schedule').val();
        body.command = $('#task-command').val();

        $.ajax({
            url: '/ajax/task',
            type: 'POST',
            data: JSON.stringify(body),
            contentType: 'application/json',
            success: function(result) {
                window.location = '/';
            }
        });
    });

    $('#schedule-edit-submit').on('click', function() {
        let body = {};

        body.name = $('#schedule-name').val();
        body.pattern = $('#schedule-pattern').val();

        $.ajax({
            url: '/ajax/schedule',
            type: 'POST',
            data: JSON.stringify(body),
            contentType: 'application/json',
            success: function(result) {
                window.location = '/schedules';
            }
        });
    });

    $.ajax({
        url: '/ajax/schedules',
        type: 'GET',
        success: function(data) {
            $.each(data.data, function (i, item) {
                $('#task-schedule').append($('<option>', {
                    value: item.id,
                    text : item.name + ' [ ' + item.pattern + ' ]'
                }));
            });
        }
    });
});

